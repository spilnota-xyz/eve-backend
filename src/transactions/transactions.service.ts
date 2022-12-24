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

  // private async getNFTsRecieved(address: string) {
  //   const transactions = await this.nftportService.getTransactionsByAddress(
  //     'ethereum',
  //     address
  //   )
  //   return transactions
  //     .filter<NFTPortTransactionTransfer>(NFTPortTransactionGuard.isTransfer)
  //     .filter(
  //       ({ transfer_to, type }) =>
  //         type === NFTPortTransactionType.TRANSFER && transfer_to === address
  //     )
  // }

  // private async getNFTsSent(address: string) {
  //   const transactions = await this.nftportService.getTransactionsByAddress(
  //     'ethereum',
  //     address
  //   )
  //   return transactions
  //     .filter<NFTPortTransactionTransfer>(NFTPortTransactionGuard.isTransfer)
  //     .filter(
  //       ({ transfer_from, type }) =>
  //         type === NFTPortTransactionType.TRANSFER && transfer_from === address
  //     )
  // }

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

  async getTransactions(address: string): Promise<any> {
    const biggestSale = await this.getBiggestNFTSale(address)

    const biggestPurchase = await this.getBiggestNFTPurchase(address)

    const totalBought = await this.getTotalBoughtInETH(address)

    const totalSold = await this.getTotalSoldInETH(address)

    const totalSpentOnMint = await this.getTotalSpentOnMintInETH(address)

    const totalNFTsMinted = await this.getTotalNFTsMinted(address)

    return {
      biggestSale,
      biggestPurchase,
      totalBought,
      totalSold,
      totalSpentOnMint,
      totalNFTsMinted
    }
  }
}
