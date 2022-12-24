import { Controller, Get, Param } from '@nestjs/common'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly appService: TransactionsService) {}

  @Get(':address')
  getTransactions(@Param('address') address: string) {
    return this.appService.getTransactions(address.toLowerCase())
  }
}
