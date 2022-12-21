export const Schema = {
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  etherscan: {
    apiKey: {
      doc: 'Etherscan API key',
      // protected: true,
      format: String,
      default: '',
      env: 'ETHERSCAN_API_KEY',
      arg: 'etherscan'
    },
    baseURL: {
      doc: 'Etherscan API base URL',
      format: String,
      default: 'https://api.etherscan.io/api',
      env: 'ETHERSCAN_BASE_URL',
      arg: 'etherscan-base-url'
    },
    throttling: {
      maxRequests: {
        doc: 'Maximum number of requests per time window',
        format: Number,
        default: 1,
        env: 'ETHERSCAN_THROTTLING_MAX_REQUESTS',
        arg: 'etherscan-max-requests'
      },
      perMilliseconds: {
        doc: 'Time window in milliseconds',
        format: Number,
        default: 5000,
        env: 'ETHERSCAN_THROTTLING_PER_MILLISECONDS',
        arg: 'etherscan-per-milliseconds'
      }
    }
  }
}
