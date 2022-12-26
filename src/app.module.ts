import { TwitterAuthModule } from '@nestjs-hybrid-auth/twitter'
import { Module, CacheModule } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { TransactionsModule } from './transactions/transactions.module'
import { TwitterOauthModule } from './twitter-oauth/twitter-oauth.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 600 * 1000, isGlobal: true }),
    TwitterOauthModule,
    TransactionsModule,
    TwitterAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        consumerKey: configService.get('twitter.customerId'),
        consumerSecret: configService.get('twitter.customerSecret'),
        callbackURL: configService.get('twitter.callbackUrl')
      })
    })
  ],
  providers: [AppService]
})
export class AppModule {}
