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
  readonly bluechips?: number

  @IsOptional()
  @IsNumber()
  readonly avgHoldTime?: number

  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsString()
  readonly image: string

  @IsNotEmpty()
  @IsNumber()
  readonly gradientIndex: number

  @IsOptional()
  @IsString()
  readonly favouriteCommunity?: string

  @IsOptional()
  @IsString()
  readonly wish?: string

  @IsOptional()
  @IsString()
  readonly whoBroughtMeHere?: string
}
