import { Resolver, Mutation, Args, Context, Query, PickType } from '@nestjs/graphql'
import { NewPost } from '@generator'
import { getMongoRepository } from 'typeorm'
import { PostEntity, UserEntity } from '@entities'
import { PIPELINE_USER, PIPELINE_COMMUNITY } from '@constants'

@Resolver('Post')
export class PostResolver {
  @Mutation()
  async createPost(@Context('currentUser') currentUser: UserEntity, @Args('newPost') newPost: NewPost) {
    const createdPost = await getMongoRepository(PostEntity).save(new PostEntity({ ...newPost, createdBy: currentUser._id }))
    return !!createdPost
  }

  @Query()
  async posts(@Context('currentUser') currentUser: UserEntity) {
    console.log(currentUser)
    const results = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          isActive: true
        },
        
      },
      {
        $sort : { createdAt : -1}
      },
      ...PIPELINE_USER,
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return results
  }
  @Query()
  async postById(@Args('id') id: string) {
    const results = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          _id: id
        }
      },
      ...PIPELINE_USER,
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return results ? results[0] : null
  }
  @Query()
  async postsByCommunity(@Args('communityId') communityId: string) {
    const results = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          communityId: communityId
        }
      },
      ...PIPELINE_USER,
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return results
  }
  @Query()
  async postsByUser(@Args('userId') userId: string) {
    const results = await getMongoRepository(PostEntity).aggregate([
      {
        $match: {
          createdBy: userId
        }
      },
      ...PIPELINE_USER,
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return results
  }
}
