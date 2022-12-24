import { Module, CacheModule } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { TransactionsModule } from './transactions/transactions.module'

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({ ttl: 600 * 1000, isGlobal: true }),
    TransactionsModule
  ],
  providers: [AppService]
})
export class AppModule {}
