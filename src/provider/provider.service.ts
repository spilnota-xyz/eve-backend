import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'

import { AlchemyProvider, Provider } from '@ethersproject/providers'

@Injectable()
export class ProviderService {
  private readonly provider: Provider
  constructor(private readonly configService: ConfigService) {
    this.provider = new AlchemyProvider(
      1,
      this.configService.get('alchemy.apiKey')
    )
  }

  getProvider() {
    return this.provider
  }
}
