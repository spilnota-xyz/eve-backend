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
  }
}
