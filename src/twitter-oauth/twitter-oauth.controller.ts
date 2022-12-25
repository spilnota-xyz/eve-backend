import { TwitterAuthResult, UseTwitterAuth } from '@nestjs-hybrid-auth/twitter'
import { Controller, Get, Request } from '@nestjs/common'

@Controller('twitter')
export class TwitterOauthController {
  @UseTwitterAuth()
  @Get('auth')
  loginWithTwitter() {
    return 'Login with Twitter'
  }

  @UseTwitterAuth()
  @Get('callback')
  twitterCallback(@Request() req: any): Partial<TwitterAuthResult> {
    const result: TwitterAuthResult = req.hybridAuthResult
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      profile: result.profile
    }
  }
}
