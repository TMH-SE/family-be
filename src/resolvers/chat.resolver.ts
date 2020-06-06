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
      },
      order: {lastActivity: 'DESC'}
    })
    // chatFound.sort((a, b) => a.lastActivity - b.lastActivity)
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
          members,
          lastActivity: +new Date()
        })
      )
  console.log(chatFound, chatCreated )
      return chatCreated
  }

  @Mutation()
  async updateChat(@Args('chatId') chatId: string): Promise<boolean> {
    const chatRepository = getMongoRepository(ChatEntity)
    const chatFound = await chatRepository.findOne({ _id: chatId })
    if(chatFound)
      chatRepository.save( new ChatEntity({
        ...chatFound,
        lastActivity: +new Date()
      }))
      console.log(chatFound, 'chatfonud')
      return true
  }
}
