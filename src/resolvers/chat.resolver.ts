/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { ChatEntity } from '@entities'

@Resolver('Chat')
export class ChatResolver {

  @Query()
  async getChatByUser(@Args('userId') userId: string) : Promise<ChatEntity[]> {
    const chatFound = await getMongoRepository(ChatEntity).find({
      where: { 
        members: userId
      }
    })
    return chatFound
  }
 
  @Query()
  async getChatByMembers(@Args('members') members: [string]) : Promise<ChatEntity> {
    const chatFound = await getMongoRepository(ChatEntity).findOne({
        members
      })
    return chatFound
  }
  @Mutation()
  async createChat(@Args('members') members: [string]): Promise<ChatEntity> {
      const chatRepository = getMongoRepository(ChatEntity)
    const chatFound = await this.getChatByMembers(members)
    if (!chatFound) {
        console.log('err')
    //   throw new AuthenticationError('Email or password is invalid')
    }
    const chatCreated = await chatRepository.save(
        new ChatEntity({
          members
        })
      )
  console.log(chatFound, chatCreated )
      return chatCreated
  }

  @Mutation()
  async deleteAll(): Promise<boolean> {
       getMongoRepository(ChatEntity).deleteMany({
         members: "9060abf0-a158-11ea-af70-039490da2a90" 
       })
      return true
  }
}
