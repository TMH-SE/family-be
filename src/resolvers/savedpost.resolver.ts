/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { SavedPostInput, PostInput } from '@generator'
import { SavedPostEntity } from '@entities'

@Resolver('SavedPost')
export class SavedPostResolver {
  @Query()
  async getSavedPostByUser(@Args('userId') userId: string) {
    const savedpostFound = await getMongoRepository(SavedPostEntity).find()
    // {  where: {
    //     _id: { userId }
    //   }
    // })

    return savedpostFound.filter(item => item._id.userId === userId)
  }
  @Query()
  async checkIsSaved(@Args('id') id: SavedPostInput): Promise<boolean> {
    const savedpostFound = await getMongoRepository(SavedPostEntity).findOne({
      _id: id
    })
    return !!savedpostFound
  }
  @Mutation()
  async createAndDeleteSavedPost(
    @Args('id') id: SavedPostInput,
    @Args('post') post: PostInput
  ): Promise<boolean> {
    const savedpostRepository = getMongoRepository(SavedPostEntity)
    const savedpostFound = await this.checkIsSaved(id)
    if (savedpostFound) {
      await savedpostRepository.findOneAndDelete({ _id: id })
    } else {
      await savedpostRepository.save(
        new SavedPostEntity({
          _id: id,
          post: post
        })
      )
    }
    return true
  }
  @Mutation()
  async deleteAllSaved(): Promise<boolean> {
    await getMongoRepository(SavedPostEntity).deleteMany({})
    return true
  }
}
