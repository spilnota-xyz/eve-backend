import { Controller, Get, Param } from '@nestjs/common'
import { TwitterService } from './twitter.service'

@Controller('twitter')
export class TwitterController {
  constructor(private readonly service: TwitterService) {}

  @Get(':username')
  getTransactions(@Param('username') username: string) {
    return this.service.getProfile(username)
  }
}
