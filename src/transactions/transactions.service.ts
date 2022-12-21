import { Injectable } from '@nestjs/common'
import { EtherscanService } from '../etherscan/etherscan.service'

@Injectable()
export class TransactionsService {
  constructor(private readonly etherscanService: EtherscanService) {}

  getTransactions(address: string): Promise<any> {
    return this.etherscanService.getERC721Transactions(address)
  }
}
