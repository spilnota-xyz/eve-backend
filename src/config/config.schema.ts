export const Schema = {
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  nftPort: {
    apiKey: {
      doc: 'The API key to use when making requests to the NFTPort API.',
      format: String,
      default: '',
      env: 'NFTPORT_API_KEY',
      arg: 'nft-port-api-key'
    }
  },
  alchemy: {
    apiKey: {
      doc: 'The API key to use when making requests to the Alchemy API.',
      format: String,
      default: '',
      env: 'ALCHEMY_API_KEY',
      arg: 'alchemy-api-key'
    }
  },
  session: {
    secret: {
      doc: 'Session secret',
      format: String,
      default: '',
      env: 'SESSION_SECRET',
      arg: 'session-secret'
    }
  },
  twitter: {
    customerId: {
      doc: 'Twitter Customer ID',
      format: String,
      default: '',
      env: 'TWITTER_CUSTOMER_ID',
      arg: 'twitter-customer-id'
    },
    customerSecret: {
      doc: 'Twitter Customer Secret',
      format: String,
      default: '',
      env: 'TWITTER_CUSTOMER_SECRET',
      arg: 'twitter-customer-secret'
    },
    callbackUrl: {
      doc: 'Twitter callback URL',
      format: String,
      default: '',
      env: 'TWITTER_CALLBACK_URL',
      arg: 'twitter-callback-url'
    }
  }
}
