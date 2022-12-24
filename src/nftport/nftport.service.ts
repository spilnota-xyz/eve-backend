import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { AxiosInstance } from 'axios'
import Axios from 'axios'
import { ConfigService } from '../config/config.service'
import {
  NFTPortGetTransactionsByAddressResponse,
  NFTPortTransaction
} from './nftport.responses.interface'
import { Cache } from 'cache-manager'
import axiosRetry from 'axios-retry'
import axiosRateLimit from 'axios-rate-limit'

@Injectable()
export class NFTPortService {
  private axios: AxiosInstance
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.axios = axiosRateLimit(Axios.create(), {
      maxRequests: 3,
      perMilliseconds: 1100
    })
    axiosRetry(this.axios, { retryDelay: axiosRetry.exponentialDelay })

    this.axios.interceptors.request.use((request) => {
      // console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
  }

  async getTransactionsByAddress(
    chain: 'ethereum' | 'polygon',
    address: string
  ): Promise<NFTPortTransaction[]> {
    const cacheKey = `transactions-${chain}-${address}`

    const cachedTransactions = await this.cacheManager.get<
      NFTPortTransaction[]
    >(cacheKey)
    if (cachedTransactions) return cachedTransactions

    const allTransactions: NFTPortTransaction[] = []
    let continuationIterator: undefined | string

    while (true) {
      const {
        data: { response, transactions, error, continuation }
      } = await this.axios.get<NFTPortGetTransactionsByAddressResponse>(
        `https://api.nftport.xyz/v0/transactions/accounts/${address}`,
        {
          headers: {
            Authorization: this.configService.get('nftPort.apiKey')
          },
          params: {
            chain,
            type: 'all',
            ...(continuationIterator && {
              continuation: continuationIterator
            })
          }
        }
      )

      if (response === 'NOK') {
        Logger.warn('NFTPort returned NOK for transactions', error)
        throw new InternalServerErrorException(error.message)
      }
      allTransactions.push(...transactions)

      if (!continuation) {
        break
      }
      continuationIterator = continuation
    }

    await this.cacheManager.set(cacheKey, allTransactions)

    return allTransactions
  }
}
