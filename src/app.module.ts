import { Module } from '@nestjs/common'
import { AuthService } from '@auth'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLConfiguration, TypeORMConfiguration } from '@config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Resolvers from '@resolvers'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphQLConfiguration
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfiguration
    })
  ],
  providers: [AuthService, ...Object.values(Resolvers)]
})
export class AppModule {}
