import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { NFTPortService } from './nftport.service'

@Module({
  imports: [ConfigModule],
  providers: [NFTPortService],
  exports: [NFTPortService]
})
export class NFTPortModule {}
