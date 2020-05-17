import { Resolver, Query } from '@nestjs/graphql'

@Resolver()
export class CommonResolver {
  @Query()
  async hello(): Promise<string> {
    return 'xin chao'
  }
}
