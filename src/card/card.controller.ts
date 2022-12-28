import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CardService } from './card.service'
import { CreateCardDto } from './dto/create-card.dto'

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // save card route
  @Post()
  saveCard(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto)
  }

  @Get(':slug')
  getCard(@Param('slug') slug: string) {
    return this.cardService.findBySlug(slug)
  }
}
