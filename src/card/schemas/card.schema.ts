import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CardDocument = HydratedDocument<Card>

@Schema()
export class Card {
  @Prop()
  biggestSale: number

  @Prop()
  biggestPurchase: number

  @Prop()
  totalBought: number

  @Prop()
  totalSold: number

  @Prop()
  totalBoughtInETH: number

  @Prop()
  totalSoldInETH: number

  @Prop()
  totalSpentOnMint: number

  @Prop()
  totalNFTsMinted: number

  @Prop()
  coolHoldings: number

  @Prop()
  averageHoldTime: number

  @Prop({ required: true })
  slug: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  image: string

  @Prop({ required: true })
  gradientIndex: number
}

export const CardSchema = SchemaFactory.createForClass(Card)
