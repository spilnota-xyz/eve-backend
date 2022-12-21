import { Injectable } from '@nestjs/common'
import convict from 'convict'
import { Schema } from './config.schema'

@Injectable()
export class ConfigService {
  readonly #config = convict(Schema).validate()
  readonly get = this.#config.get.bind(this.#config)
  readonly set = this.#config.set.bind(this.#config)
}
