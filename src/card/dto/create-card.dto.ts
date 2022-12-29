import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator'

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

  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsString()
  readonly image: string

  @IsNotEmpty()
  @IsNumber()
  readonly gradientIndex: number

  @IsNotEmpty()
  @IsString()
  readonly favouriteCommunity: string

  @IsNotEmpty()
  @IsString()
  readonly wish: string

  @IsOptional()
  @IsString()
  readonly whoBroughtMeHere: string
}
