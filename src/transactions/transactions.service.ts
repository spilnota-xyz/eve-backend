import { formatEther, parseEther } from '@ethersproject/units'
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'
import {
  NFTPortRetrieveContractsOwnedByAnAccount,
  NFTPortTransaction,
  NFTPortTransactionGuard,
  NFTPortTransactionSale,
  NFTPortTransactionTransfer,
  NFTPortTransactionType
} from '../nftport/nftport.responses.interface'
import { NFTPortService } from '../nftport/nftport.service'
import { ProviderService } from '../provider/provider.service'
import { Cache } from 'cache-manager'
import { TransactionResponse } from '@ethersproject/providers'

@Injectable()
export class TransactionsService {
  constructor(
    private readonly nftportService: NFTPortService,
    private readonly providerService: ProviderService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async getNFTsBought(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    return transactions
      .filter<NFTPortTransactionSale>(NFTPortTransactionGuard.isSale)
      .filter(({ buyer_address }) => buyer_address === address)
  }

  public async getNFTsBoughtQuantity(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const boughtNFTs = await this.getNFTsBought(transactions, address)
    return boughtNFTs.reduce(
      (total, current) => total + (current.quantity ?? 0),
      0
    )
  }

  public async getNFTsSold(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    return transactions
      .filter<NFTPortTransactionSale>(NFTPortTransactionGuard.isSale)
      .filter(({ seller_address }) => seller_address === address)
  }

  public async getNFTsSoldQuantity(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const soldNFTs = await this.getNFTsSold(transactions, address)
    return soldNFTs.reduce(
      (total, current) => total + (current.quantity ?? 0),
      0
    )
  }

  private async getNFTsMinted(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    return transactions
      .filter<NFTPortTransactionTransfer>(NFTPortTransactionGuard.isTransfer)
      .filter(
        ({ owner_address, type }) =>
          type === NFTPortTransactionType.MINT && owner_address === address
      )
  }

  public async getTotalSpentOnMintInETH(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const provider = this.providerService.getProvider()

    const minted = await this.getNFTsMinted(transactions, address)

    let totalSpent = parseEther('0')
    for (const mintTransaction of minted) {
      const cacheKey = `tx:${mintTransaction.transaction_hash}`
      const cached = await this.cacheManager.get<TransactionResponse>(cacheKey)

      const tx =
        cached ??
        (await provider.getTransaction(mintTransaction.transaction_hash))

      if (!cached) await this.cacheManager.set(cacheKey, tx)
      totalSpent = totalSpent.add(tx.value)
    }

    return parseFloat(formatEther(totalSpent))
  }

  public async getTotalNFTsMinted(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const minted = await this.getNFTsMinted(transactions, address)
    return minted.reduce((total, current) => total + current.quantity, 0)
  }

  public async getBiggestNFTSale(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const sold = await this.getNFTsSold(transactions, address)
    const soldInETH = sold.filter(
      ({ price_details }) => price_details?.asset_type === 'ETH'
    )
    return soldInETH.reduce((biggest, current) => {
      if ((current.price_details?.price ?? biggest) > biggest)
        return current.price_details?.price ?? biggest
      return biggest
    }, soldInETH[0]?.price_details.price ?? 0)
  }

  public async getBiggestNFTPurchase(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const bought = await this.getNFTsBought(transactions, address)
    const boughtInETH = bought.filter(
      ({ price_details }) => price_details?.asset_type === 'ETH'
    )
    return boughtInETH.reduce((biggest, current) => {
      if ((current.price_details?.price ?? biggest) > biggest)
        return current.price_details?.price ?? biggest
      return biggest
    }, boughtInETH[0]?.price_details.price ?? 0)
  }

  public async getTotalSoldInETH(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const sold = await this.getNFTsSold(transactions, address)
    const soldInETH = sold.filter(
      ({ price_details }) => price_details?.asset_type === 'ETH'
    )

    return soldInETH.reduce((total, current) => {
      return total + (current.price_details?.price ?? 0)
    }, 0)
  }

  public async getTotalBoughtInETH(
    transactions: NFTPortTransaction[],
    address: string
  ) {
    const bought = await this.getNFTsBought(transactions, address)
    const boughtInETH = bought.filter(
      ({ price_details }) => price_details?.asset_type === 'ETH'
    )

    return boughtInETH.reduce((total, current) => {
      return total + (current.price_details?.price ?? 0)
    }, 0)
  }

  public async getBluechips(
    ownedContracts: NFTPortRetrieveContractsOwnedByAnAccount[]
  ) {
    const ownedContractsStatistics = await Promise.all(
      ownedContracts.map(({ address }) =>
        this.nftportService.getContractSalesStatistics('ethereum', address)
      )
    )

    console.log(
      ownedContractsStatistics.filter(
        (data) => data && data.floor_price >= 1 && data.thirty_day_volume >= 30
      )
    )

    return ownedContractsStatistics.filter(
      (data) => data && data.floor_price >= 1 && data.thirty_day_volume >= 30
    ).length
  }

  private findKey(acc: Record<string, any>, key: string): string {
    if (acc[key]?.length === 2) return this.findKey(acc, key + '_')
    else return key
  }

  public async getAverageHoldTime(transactions: NFTPortTransaction[]) {
    const transfers = transactions.filter(NFTPortTransactionGuard.isTransfer)

    const richTranfers = new Array<NFTPortTransactionTransfer>()

    for (const transfer of transfers) {
      const { contract_address } = transfer
      const salesStatistics =
        await this.nftportService.getContractSalesStatistics(
          'ethereum',
          contract_address
        )
      if (salesStatistics?.floor_price ?? 0 > 0.2) richTranfers.push(transfer)
    }

    // pull out the first and last transfer of the token id in a set
    const nftTransfersDates = Object.values(
      richTranfers.reduceRight(
        (acc, { transaction_date, contract_address, token_id }) => {
          // in rare case there can be more than two in-out transfers for single token_id
          const key = this.findKey(acc, `${contract_address}-${token_id}`)

          const date = new Date(transaction_date)

          acc[key] = acc[key]?.concat(date) ?? [date]
          return acc
        },
        {} as Record<string, Date[]>
      )
    )

    // avg(T_n) = E (T[i->n]/n)
    return {
      avgHoldTime: Math.floor(
        nftTransfersDates.reduce(
          (total, dates) =>
            (total +=
              ((dates[1]?.getTime() ?? Date.now()) - dates[0].getTime()) /
              (nftTransfersDates.length * 1000)),
          0
        )
      ),
      holdTransactions: nftTransfersDates.length
    }
  }

  public async getOwnedContracts(address: string): Promise<any> {
    return this.nftportService.getContractsOwnedByAnAccount('ethereum', address)
  }

  async getTransactions(
    address: string,
    continuationTransactions?: string
  ): Promise<any> {
    return await this.nftportService.getTransactionsByAddress(
      'ethereum',
      address,
      continuationTransactions
    )
  }
}
