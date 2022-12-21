import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { AxiosInstance } from 'axios'
import axiosRateLimit from 'axios-rate-limit'
import Axios from 'axios'
import { ConfigService } from '../config/config.service'

@Injectable()
export class EtherscanService {
  private axios: AxiosInstance
  constructor(private readonly configService: ConfigService) {
    this.axios = axiosRateLimit(Axios.create(), {
      maxRequests: configService.get('etherscan.throttling.maxRequests'),
      perMilliseconds: configService.get('etherscan.throttling.perMilliseconds')
    })
    this.axios.interceptors.request.use((request) => {
      // console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
  }

  async getERC721Transactions(address: string): Promise<
    {
      blockNumber: string
      timeStamp: string
      hash: string
      nonce: string
      blockHash: string
      from: string
      contractAddress: string
      to: string
      tokenID: string
      tokenName: string
      tokenSymbol: string
      tokenDecimal: string
      transactionIndex: string
      gas: string
      gasPrice: string
      gasUsed: string
      cumulativeGasUsed: string
      input: string
      confirmations: string
    }[]
  > {
    const {
      data: { result, status, message }
    } = await this.axios.get<
      any,
      { data: { status: string; message: string; result: any } }
    >(`${this.configService.get('etherscan.baseURL')}`, {
      params: {
        module: 'account',
        action: 'tokennfttx',
        address,
        page: 1,
        offset: 10000,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apikey: this.configService.get('etherscan.apiKey')
      }
    })

    if (status === '0' && message === 'No transactions found') return []

    if (status !== '1') {
      Logger.log(
        `Something went wrong:\n\tEtherscan Response Status: ${status}\n\tEtherscan Response Message: ${message}\n\tEtherscan Response Result: ${result}`,
        'EtherscanService'
      )
      throw new InternalServerErrorException()
    }

    return result
  }
}
