export enum NFTPortTransactionType {
  BID = 'bid',
  CANCEL_BID = 'cancel_bid',
  SALE = 'sale',
  TRANSFER = 'transfer',
  MINT = 'mint',
  BURN = 'burn',
  LIST = 'list',
  CANCEL_LIST = 'cancel_list'
}

export type NFTPortTransactionNFT = {
  contract_type?: 'ERC721' | 'ERC1155' | 'ERC721_lazy' | 'ERC1155_lazy'
  contract_address?: string
  token_id?: string
  metadata_url?: string
  creators: { account_address: string; creator_share: number }[]
  royalties: { account_address: string; royalty_share: number }[]
  signatures?: string[]
  total?: number
}

export type NFTPortTransactionPriceDetails = {
  asset_type?: 'ETH' | 'ERC20'
  contract_address?: string
  price?: number
  price_usd?: number
}

export type NFTPortTransactionListing = {
  type: NFTPortTransactionType.LIST | NFTPortTransactionType.CANCEL_LIST
  lister_address: string
  nft: NFTPortTransactionNFT
  quantity?: number
  price_details: NFTPortTransactionPriceDetails
  transaction_hash?: string
  block_hash?: string
  transaction_date: string
  marketplace?: 'opensea' | 'rarible'
}

export type NFTPortTransactionBid = {
  type: NFTPortTransactionType.BID | NFTPortTransactionType.CANCEL_BID
  bidder_address: string
  nft: NFTPortTransactionNFT
  quantity?: number
  price_details: NFTPortTransactionPriceDetails
  transaction_hash: string
  block_hash: string
  block_number: number
  transaction_date: string
  marketplace?: 'opensea' | 'rarible'
}

export type NFTPortTransactionSale = {
  type: NFTPortTransactionType.SALE
  buyer_address?: string
  seller_address: string
  nft: NFTPortTransactionNFT
  quantity?: number
  price_details: NFTPortTransactionPriceDetails
  transaction_hash: string
  block_hash: string
  block_number: number
  transaction_date: string
  marketplace?: 'opensea' | 'rarible'
}

export type NFTPortTransactionTransfer = {
  type:
    | NFTPortTransactionType.TRANSFER
    | NFTPortTransactionType.MINT
    | NFTPortTransactionType.BURN
  owner_address?: string
  transfer_from?: string
  transfer_to?: string
  contract_address: string
  token_id: string
  quantity: number
  transaction_hash: string
  block_hash: string
  block_number: number
  transaction_date: string
}

export type NFTPortTransaction =
  | NFTPortTransactionBid
  | NFTPortTransactionSale
  | NFTPortTransactionTransfer
  | NFTPortTransactionListing

export type NFTPortGetTransactionsByAddressResponse =
  | {
      response: 'OK'
      error: never
      transactions: NFTPortTransaction[]
      continuation?: string
    }
  | {
      response: 'NOK'
      error: {
        status_code: number
        code: string
        message: string
      }
      transactions: never
      continuation: never
    }

export class NFTPortTransactionGuard {
  static isBid(
    transaction: NFTPortTransaction
  ): transaction is NFTPortTransactionBid {
    return (
      transaction.type === NFTPortTransactionType.BID ||
      transaction.type === NFTPortTransactionType.CANCEL_BID
    )
  }

  static isSale(
    transaction: NFTPortTransaction
  ): transaction is NFTPortTransactionSale {
    return transaction.type === NFTPortTransactionType.SALE
  }

  static isTransfer(
    transaction: NFTPortTransaction
  ): transaction is NFTPortTransactionTransfer {
    return (
      transaction.type === NFTPortTransactionType.TRANSFER ||
      transaction.type === NFTPortTransactionType.MINT ||
      transaction.type === NFTPortTransactionType.BURN
    )
  }

  static isListing(
    transaction: NFTPortTransaction
  ): transaction is NFTPortTransactionListing {
    return (
      transaction.type === NFTPortTransactionType.LIST ||
      transaction.type === NFTPortTransactionType.CANCEL_LIST
    )
  }
}
