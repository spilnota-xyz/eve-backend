import { Module } from '@nestjs/common'
import { EtherscanModule } from '../etherscan/etherscan.module'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

@Module({
  providers: [TransactionsService],
  imports: [EtherscanModule],
  controllers: [TransactionsController],
  exports: [TransactionsService]
})
export class TransactionsModule {}
