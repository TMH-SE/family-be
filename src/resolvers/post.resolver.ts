import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql'
import { NewPost } from '@generator'
import { getMongoRepository } from 'typeorm'
import { PostEntity, UserEntity } from '@entities'
import { PIPELINE_USER } from '@constants'

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
        }
      },
      ...PIPELINE_USER
    ]).toArray()
    console.log(results)
    return results
  }
}
