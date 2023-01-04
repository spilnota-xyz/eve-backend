import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode
} from '@nestjs/common'
import {
  NFTPortRetrieveContractsOwnedByAnAccount,
  NFTPortTransaction
} from '../nftport/nftport.responses.interface'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get('/transactions/:address')
  getTransactions(
    @Param('address') address: string,
    @Query('continuation') continuation: string
  ) {
    return this.service.getTransactions(address.toLowerCase(), continuation)
  }

  @Get('/owned-contracts/:address')
  getOwnedContracts(@Param('address') address: string) {
    return this.service.getOwnedContracts(address.toLowerCase())
  }

  @Post('/biggest-sale/:address')
  @HttpCode(200)
  getBiggestSale(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getBiggestNFTSale(transactions, address.toLowerCase())
  }

  @Post('/biggest-purchase/:address')
  @HttpCode(200)
  getBiggestPurchase(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getBiggestNFTPurchase(
      transactions,
      address.toLowerCase()
    )
  }

  @Post('/total-spent-on-mint/:address')
  @HttpCode(200)
  getTotalSpentOnMint(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getTotalSpentOnMintInETH(
      transactions,
      address.toLowerCase()
    )
  }

  @Post('/total-minted/:address')
  @HttpCode(200)
  getTotalMinted(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getTotalNFTsMinted(transactions, address.toLowerCase())
  }

  @Post('/total-bought/:address')
  @HttpCode(200)
  getTotalBought(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getNFTsBoughtQuantity(
      transactions,
      address.toLowerCase()
    )
  }

  @Post('/total-sold/:address')
  @HttpCode(200)
  getTotalSold(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getNFTsSoldQuantity(transactions, address.toLowerCase())
  }

  @Post('/total-bought-in-eth/:address')
  @HttpCode(200)
  getTotalBoughtInETH(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getTotalBoughtInETH(transactions, address.toLowerCase())
  }

  @Post('/total-sold-in-eth/:address')
  @HttpCode(200)
  getTotalSoldInETH(
    @Body('transactions') transactions: NFTPortTransaction[],
    @Param('address') address: string
  ) {
    return this.service.getTotalSoldInETH(transactions, address.toLowerCase())
  }

  @Post('/average-hold-time/:address')
  @HttpCode(200)
  getAverageHoldTime(@Body('transactions') transactions: NFTPortTransaction[]) {
    return this.service.getAverageHoldTime(transactions)
  }

  @Post('/bluechips/:address')
  @HttpCode(200)
  getBluechips(
    @Body('contracts')
    ownedContracts: NFTPortRetrieveContractsOwnedByAnAccount[]
  ) {
    return this.service.getBluechips(ownedContracts)
  }
}
