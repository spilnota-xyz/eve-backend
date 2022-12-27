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
  NFTPortContractSalesStatistics,
  NFTPortContractSalesStatisticsResponse,
  NFTPortGetTransactionsByAddressResponse,
  NFTPortRetrieveContractsOwnedByAnAccount,
  NFTPortRetrieveContractsOwnedByAnAccountResponse,
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
      maxRequests: 2,
      perMilliseconds: 1000
    })
    axiosRetry(this.axios, { retryDelay: axiosRetry.exponentialDelay })

    this.axios.interceptors.request.use((request) => {
      // console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
  }

  async getContractsOwnedByAnAccount(
    chain: 'ethereum' | 'polygon',
    address: string
  ): Promise<NFTPortRetrieveContractsOwnedByAnAccount[]> {
    const cacheKey = `owned-${chain}-${address}`

    const cachedContracts = await this.cacheManager.get<
      NFTPortRetrieveContractsOwnedByAnAccount[]
    >(cacheKey)
    if (cachedContracts) return cachedContracts

    const allContracts: NFTPortRetrieveContractsOwnedByAnAccount[] = []
    let continuationIterator: undefined | string

    while (true) {
      const {
        data: { response, contracts, error, continuation }
      } =
        await this.axios.get<NFTPortRetrieveContractsOwnedByAnAccountResponse>(
          `https://api.nftport.xyz/v0/accounts/contracts/${address}`,
          {
            headers: {
              Authorization: this.configService.get('nftPort.apiKey')
            },
            params: {
              chain,
              type: 'owns_contract_nfts',
              ...(continuationIterator && {
                continuation: continuationIterator
              })
            }
          }
        )

      if (response === 'NOK') {
        Logger.warn(
          `NFTPort returned NOK for transactions: ${JSON.stringify(
            error,
            null,
            2
          )}`,
          'NFTPortService'
        )
        throw new InternalServerErrorException(error.message)
      }
      allContracts.push(...contracts)

      if (!continuation) {
        break
      }
      continuationIterator = continuation
    }

    await this.cacheManager.set(cacheKey, allContracts)

    return allContracts
  }

  async getContractSalesStatistics(
    chain: 'ethereum' | 'polygon',
    contractAddress: string
  ): Promise<NFTPortContractSalesStatistics | null> {
    const cacheKey = `stats-${chain}-${contractAddress}`

    const cachedStats =
      await this.cacheManager.get<NFTPortContractSalesStatistics>(cacheKey)
    if (cachedStats) return cachedStats

    const {
      data: { response, statistics, error }
    } = await this.axios.get<NFTPortContractSalesStatisticsResponse>(
      `https://api.nftport.xyz/v0/transactions/stats/${contractAddress}`,
      {
        headers: {
          Authorization: this.configService.get('nftPort.apiKey')
        },
        params: {
          chain
        },
        validateStatus: (status) => status === 200 || status === 404
      }
    )

    if (response === 'NOK') {
      Logger.warn(
        `NFTPort returned NOK for statistics: ${chain} ${contractAddress} ${JSON.stringify(
          error,
          null,
          2
        )}`,
        'NFTPortService'
      )
      return null
    }

    await this.cacheManager.set(cacheKey, statistics)

    return statistics
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
        Logger.warn(
          `NFTPort returned NOK for transactions: ${JSON.stringify(
            error,
            null,
            2
          )}`,
          'NFTPortService'
        )
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
