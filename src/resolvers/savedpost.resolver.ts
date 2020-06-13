/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { PIPELINE_USER, PIPELINE_POST, PIPELINE_COMMUNITY } from '@constants'
import { SavedPostInput } from '@generator'
import { SavedPostEntity, PostEntity } from '@entities'

@Resolver('SavedPost')
export class SavedPostResolver {
  @Query()
  async getSavedPostByUser(@Args('userId') userId: string) {
    const savedpostFound = await getMongoRepository(SavedPostEntity).aggregate([
      {
        $match: {
          userId: userId
        }
      },
      ...PIPELINE_USER,
      ...PIPELINE_POST
    ]).toArray()
    return savedpostFound.map(async saved => {
      const results = await getMongoRepository(PostEntity).aggregate([
        {
          $match: {
            _id: saved?.post?._id
          }
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ]).toArray()
      return {...saved, post: results[0]}
    
    })
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
    @Args('id') id: SavedPostInput
  ): Promise<boolean> {
    const savedpostRepository = getMongoRepository(SavedPostEntity)
    const savedpostFound = await this.checkIsSaved(id)
    if (savedpostFound) {
      await savedpostRepository.findOneAndDelete({ _id: id })
    } else {
      await savedpostRepository.save(
        new SavedPostEntity({
          _id: id,
          userId: id.userId,
          postId: id.postId 
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
