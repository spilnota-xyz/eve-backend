import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { ProviderService } from './provider.service'

@Module({
  imports: [ConfigModule],
  providers: [ProviderService],
  exports: [ProviderService]
})
export class ProviderModule {}
