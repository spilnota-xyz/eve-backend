import { Module } from '@nestjs/common'
import { NFTPortModule } from '../nftport/nftport.module'
import { ProviderModule } from '../provider/provider.module'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

@Module({
  providers: [TransactionsService],
  imports: [NFTPortModule, ProviderModule],
  controllers: [TransactionsController],
  exports: [TransactionsService]
})
export class TransactionsModule {}
