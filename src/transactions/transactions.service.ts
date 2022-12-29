import { formatEther, parseEther } from '@ethersproject/units'
import { Injectable } from '@nestjs/common'
import {
  NFTPortTransactionGuard,
  NFTPortTransactionSale,
  NFTPortTransactionTransfer,
  NFTPortTransactionType
} from '../nftport/nftport.responses.interface'
import { NFTPortService } from '../nftport/nftport.service'
import { ProviderService } from '../provider/provider.service'

@Injectable()
export class TransactionsService {
  constructor(
    private readonly nftportService: NFTPortService,
    private readonly providerService: ProviderService
  ) {}

  private async getNFTsBought(address: string) {
    const transactions = await this.nftportService.getTransactionsByAddress(
      'ethereum',
      address
    )
    return transactions
      .filter<NFTPortTransactionSale>(NFTPortTransactionGuard.isSale)
      .filter(({ buyer_address }) => buyer_address === address)
  }

  private async getNFTsSold(address: string) {
    const transactions = await this.nftportService.getTransactionsByAddress(
      'ethereum',
      address
    )
    return transactions
      .filter<NFTPortTransactionSale>(NFTPortTransactionGuard.isSale)
      .filter(({ seller_address }) => seller_address === address)
  }

  private async getNFTsMinted(address: string) {
    const transactions = await this.nftportService.getTransactionsByAddress(
      'ethereum',
      address
    )
    return transactions
      .filter<NFTPortTransactionTransfer>(NFTPortTransactionGuard.isTransfer)
      .filter(
        ({ owner_address, type }) =>
          type === NFTPortTransactionType.MINT && owner_address === address
      )
  }

  private async getTotalSpentOnMintInETH(address: string) {
    const provider = this.providerService.getProvider()

    const minted = await this.getNFTsMinted(address)

    let totalSpent = parseEther('0')
    for (const mintTransaction of minted) {
      const tx = await provider.getTransaction(mintTransaction.transaction_hash)
      totalSpent = totalSpent.add(tx.value)
    }

    return parseFloat(formatEther(totalSpent))
  }

  private async getTotalNFTsMinted(address: string) {
    const minted = await this.getNFTsMinted(address)
    return minted.reduce((total, current) => total + current.quantity, 0)
  }

  private async getBiggestNFTSale(address: string) {
    const sold = await this.getNFTsSold(address)
    return sold.reduce((biggest, current) => {
      if ((current.price_details?.price ?? biggest) > biggest)
        return current.price_details?.price ?? biggest
      return biggest
    }, sold[0]?.price_details.price ?? 0)
  }

  private async getBiggestNFTPurchase(address: string) {
    const bought = await this.getNFTsBought(address)
    return bought.reduce((biggest, current) => {
      if ((current.price_details?.price ?? biggest) > biggest)
        return current.price_details?.price ?? biggest
      return biggest
    }, bought[0]?.price_details.price ?? 0)
  }

  private async getTotalSoldInETH(address: string) {
    const sold = await this.getNFTsSold(address)
    return sold.reduce((total, current) => {
      return total + (current.price_details?.price ?? 0)
    }, 0)
  }

  private async getTotalBoughtInETH(address: string) {
    const sold = await this.getNFTsBought(address)
    return sold.reduce((total, current) => {
      return total + (current.price_details?.price ?? 0)
    }, 0)
  }

  private async getCoolHoldings(address: string) {
    const ownedContracts =
      await this.nftportService.getContractsOwnedByAnAccount(
        'ethereum',
        address
      )

    const ownedContractsStatistics = await Promise.all(
      ownedContracts.map(({ address }) =>
        this.nftportService.getContractSalesStatistics('ethereum', address)
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

  private async getAverageHoldTime(address: string) {
    const transactions = await this.nftportService.getTransactionsByAddress(
      'ethereum',
      address
    )
    const transfers = transactions.filter(NFTPortTransactionGuard.isTransfer)

    // pull out the first and last transfer of the token id in a set
    const nftTransfersDates = Object.values(
      transfers.reduceRight(
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
    return Math.floor(
      nftTransfersDates.reduce(
        (total, dates) =>
          (total +=
            ((dates[1]?.getTime() ?? Date.now()) - dates[0].getTime()) /
            (nftTransfersDates.length * 1000)),
        0
      )
    )
  }

  async getTransactions(
    address: string,
    options: {
      biggestSale?: boolean
      biggestPurchase?: boolean
      totalBought?: boolean
      totalSold?: boolean
      totalBoughtInETH?: boolean
      totalSoldInETH?: boolean
      totalSpentOnMint?: boolean
      totalNFTsMinted?: boolean
      bluechips?: boolean
      avgHoldTime?: boolean
    }
  ): Promise<any> {
    const biggestSale = options.biggestSale
      ? await this.getBiggestNFTSale(address)
      : null

    const biggestPurchase = options.biggestPurchase
      ? await this.getBiggestNFTPurchase(address)
      : null

    const totalBought = options.totalBought
      ? (await this.getNFTsBought(address)).length
      : null

    const totalSold = options.totalSold
      ? (await this.getNFTsSold(address)).length
      : null

    const totalBoughtInETH = options.totalBoughtInETH
      ? await this.getTotalBoughtInETH(address)
      : null

    const totalSoldInETH = options.totalSoldInETH
      ? await this.getTotalSoldInETH(address)
      : null

    const totalSpentOnMint = options.totalSpentOnMint
      ? await this.getTotalSpentOnMintInETH(address)
      : null

    const totalNFTsMinted = options.totalNFTsMinted
      ? await this.getTotalNFTsMinted(address)
      : null

    const bluechips = options.bluechips
      ? await this.getCoolHoldings(address)
      : null

    const avgHoldTime = options.avgHoldTime
      ? await this.getAverageHoldTime(address)
      : null

    return {
      biggestSale,
      biggestPurchase,
      totalBought,
      totalSold,
      totalBoughtInETH,
      totalSoldInETH,
      totalSpentOnMint,
      totalNFTsMinted,
      bluechips,
      avgHoldTime
    }
  }
}
