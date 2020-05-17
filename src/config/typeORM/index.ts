import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import { MONGODB_URL } from '@environment'

export class TypeORMConfiguration implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mongodb',
      url: MONGODB_URL,
      entities: getMetadataArgsStorage().tables.map(table => table.target),
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
      logging: true
    }
  }
}
