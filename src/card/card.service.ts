import { Model } from 'mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Card, CardDocument } from './schemas/card.schema'
import { CreateCardDto } from './dto/create-card.dto'
import { nanoid } from 'nanoid'

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const createdCard = new this.cardModel({
      ...createCardDto,
      slug: nanoid(7)
    })
    return createdCard.save()
  }

  async findBySlug(slug: string): Promise<Card> {
    const card = await this.cardModel.findOne({
      slug
    })
    if (!card) throw new BadRequestException('Card not found')
    return card
  }
}
