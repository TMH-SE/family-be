import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { AuthenticationError } from 'apollo-server-express'
import { AuthService } from '@auth'
import { ENDPOINT, NODE_ENV } from '@environment'

const pubSub = new PubSub()
export class GraphQLConfiguration implements GqlOptionsFactory {
  private authService = new AuthService()

  async createGqlOptions(): Promise<GqlModuleOptions> {
    console.log(NODE_ENV)
    const directiveResolvers = {
      isAuthenticated: (next, source, args, ctx) => {
        const { currentUser } = ctx
        if (!currentUser) {
          throw new AuthenticationError('Missing or invalid token!')
        }

        return next()
      },
      isAdmin: (next, source, args, ctx) => {
        const { currentUser } = ctx
        if (!currentUser.isAdmin) {
          throw new AuthenticationError('Missing or invalid token!')
        }

        return next()
      }
    }
    return {
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      path: `/${ENDPOINT}`,
      directiveResolvers,
      context: async ({ req, res, connection }) => {
        if (connection) {
          return {
            req: connection.context,
            pubSub
          }
        }
        const token = req.headers['access-token']

        let ctx = {}
        if (token) {
          ctx = await this.authService.verifyToken(token)
        }
        return { req, res, pubSub, ...ctx }
      },
      subscriptions: {
        path: `/${ENDPOINT}`,
        keepAlive: 1000,
        onConnect: async connectionParams => {
          const token = connectionParams['access-token']
          if (token) {
            const ctx = await this.authService.verifyToken(token)
            return { ...ctx }
          }
          throw new AuthenticationError('Missing auth token!')
        }
      },
      playground: NODE_ENV === 'development',
      formatError: ({ message, path, locations, extensions: { code } }) => ({
        message,
        path,
        locations,
        code
      })
    }
  }
}
