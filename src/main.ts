import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from './config/config.service'
import session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService = app.get(ConfigService)
  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: false,
      saveUninitialized: false
    })
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(configService.get('port'), () =>
    Logger.log(
      `Listening at port ${configService.get('port')}`,
      'NestApplication'
    )
  )
}
bootstrap()
