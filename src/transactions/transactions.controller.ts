import { Controller, Get, Param, Query } from '@nestjs/common'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly appService: TransactionsService) {}

  @Get(':address')
  getTransactions(
    @Param('address') address: string,
    @Query() options: Record<string, boolean>
  ) {
    return this.appService.getTransactions(address.toLowerCase(), options)
  }
}
