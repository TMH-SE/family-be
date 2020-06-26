import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT, ENDPOINT } from '@environment'
import chalk = require('chalk')
import { dbseed } from './dbseed'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)

  app.enableCors({ origin: '*' })

  dbseed()

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  console.log(`------- Server start at: ${chalk.greenBright(`${PORT}/${ENDPOINT}`)} -------`)
}
bootstrap()
