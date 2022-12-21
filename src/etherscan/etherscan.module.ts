import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { EtherscanService } from './etherscan.service'

@Module({
  imports: [ConfigModule],
  providers: [EtherscanService],
  exports: [EtherscanService]
})
export class EtherscanModule {}
