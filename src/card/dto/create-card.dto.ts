import { IsNumber, IsOptional } from 'class-validator'

export class CreateCardDto {
  @IsOptional()
  @IsNumber()
  readonly biggestSale?: number

  @IsOptional()
  @IsNumber()
  readonly biggestPurchase?: number

  @IsOptional()
  @IsNumber()
  readonly totalBought?: number

  @IsOptional()
  @IsNumber()
  readonly totalSold?: number

  @IsOptional()
  @IsNumber()
  readonly totalBoughtInETH?: number

  @IsOptional()
  @IsNumber()
  readonly totalSoldInETH?: number

  @IsOptional()
  @IsNumber()
  readonly totalSpentOnMint?: number

  @IsOptional()
  @IsNumber()
  readonly totalNFTsMinted?: number

  @IsOptional()
  @IsNumber()
  readonly coolHoldings?: number

  @IsOptional()
  @IsNumber()
  readonly averageHoldTime?: number
}
