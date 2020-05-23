import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['./src/typeDefs/*.graphql'],
  path: join(process.cwd(), 'src/generator/graphql.ts'),
  outputAs: 'class'
})
