import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { TwitterController } from './twitter.controller'
import { TwitterService } from './twitter.service'

@Module({
  imports: [ConfigModule],
  providers: [TwitterService],
  controllers: [TwitterController],
  exports: [TwitterService]
})
export class TwitterModule {}
