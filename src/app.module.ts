import { Module } from '@nestjs/common'
import { AuthService } from '@auth'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLConfiguration, TypeORMConfiguration } from '@config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Resolvers from '@resolvers'
import * as Utils from '@utils'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@interceptors'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphQLConfiguration
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfiguration
    })
  ],
  providers: [
    AuthService,
    ...Object.values(Utils),
    ...Object.values(Resolvers),
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
  ]
})
export class AppModule {}
