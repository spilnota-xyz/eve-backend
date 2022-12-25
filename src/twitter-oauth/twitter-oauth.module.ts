import { Module } from '@nestjs/common'
import { TwitterOauthController } from './twitter-oauth.controller'

@Module({
  controllers: [TwitterOauthController]
})
export class TwitterOauthModule {}
