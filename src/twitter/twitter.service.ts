import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { AxiosInstance } from 'axios'
import Axios from 'axios'
import { ConfigService } from '../config/config.service'
import { Cache } from 'cache-manager'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'
import axiosRateLimit from 'axios-rate-limit'
import { TwitterGetProfileResponse } from './twitter.responses.interface'

@Injectable()
export class TwitterService {
  private axios: AxiosInstance
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.axios = axiosRateLimit(Axios.create(), {
      maxRequests: 2,
      perMilliseconds: 1000
    })
    axiosRetry(this.axios, {
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (e) =>
        isNetworkOrIdempotentRequestError(e) || e.response?.status === 429
    })

    this.axios.interceptors.request.use((request) => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })
  }

  async getProfile(username: string): Promise<TwitterGetProfileResponse> {
    const cacheKey = `twitter-${username}`
    const cached = await this.cacheManager.get<TwitterGetProfileResponse>(
      cacheKey
    )
    if (cached) return cached

    const {
      data: { data }
    } = await this.axios.get<{ data: TwitterGetProfileResponse }>(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('twitter.token')}`
        },
        params: {
          'user.fields': 'profile_image_url,username'
        }
      }
    )

    await this.cacheManager.set(cacheKey, data)
    return data
  }
}
