import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { TransactionsModule } from './transactions/transactions.module'

@Module({
  imports: [ConfigModule, TransactionsModule],
  providers: [AppService]
})
export class AppModule {}
