import {
  Resolver,
  Mutation,
  Args,
  Context,
  Query,
  PickType
} from '@nestjs/graphql'
import { NewPost, UpdatePostInput } from '@generator'
import { getMongoRepository } from 'typeorm'
import { PostEntity, UserEntity } from '@entities'
import { PIPELINE_USER, PIPELINE_COMMUNITY } from '@constants'
import { UserInputError } from 'apollo-server-express'
import { query } from 'express'

@Resolver('Post')
export class PostResolver {
  @Mutation()
  async createPost(
    @Context('currentUser') currentUser: UserEntity,
    @Args('newPost') newPost: NewPost
  ) {
    const createdPost = await getMongoRepository(PostEntity).save(
      new PostEntity({ ...newPost, createdBy: currentUser._id })
    )
    console.log(createdPost)
    // return new PostEntity({ ...new Post, createdBy: currentUser._id }
    return createdPost
  }
  @Mutation()
  async updatePost(
    @Context('currentUser') currentUser: UserEntity,
    @Args('postId') postId: string,
    @Args('updatePost') updatePost: UpdatePostInput
  ) {
    const postRepository = getMongoRepository(PostEntity)
    const postFound = await postRepository.findOne({ _id: postId })
    if (!postFound) {
      throw new UserInputError('Không tìm thấy cộng đồng')
    }
    const updatedPost = await postRepository.save(
      new PostEntity({
        ...postFound,
        ...updatePost,
        updatedBy: currentUser?._id,
        updatedAt: +new Date()
      })
    )
    return !!updatedPost
  }
  @Mutation()
  async deletePost(
    @Context('currentUser') currentUser: UserEntity,
    @Args('postId') postId: string
  ) {
    const postFound = await getMongoRepository(PostEntity).findOne({
      _id: postId
    })
    const deletepostFound = new PostEntity({
      ...postFound,
      isActive: false,
      deletedAt: +new Date(),
      deletedBy: currentUser?._id
    })
    const deleted = await getMongoRepository(PostEntity).save(deletepostFound)
    return !!deleted
  }
  @Query()
  async posts(
    @Context('currentUser') currentUser: UserEntity,
    @Args('quantity') quantity: number
  ) {
    const results = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            isActive: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: quantity
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ])
      .toArray()
    return results
  }
  @Query()
  async postById(@Args('id') id: string) {
    const results = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            _id: id,
            isActive: true
          }
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ])
      .toArray()
    return results ? results[0] : null
  }
  @Query()
  async postsByCommunity(@Args('communityId') communityId: string) {
    const results = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            communityId: communityId,
            isActive: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ])
      .toArray()
    return results
  }
  @Query()
  async postsByUser(@Args('userId') userId: string) {
    const results = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            createdBy: userId,
            isActive: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ])
      .toArray()
    return results
  }

  @Mutation()
  async searchAllPosts(@Args('query') query: string) {
    const keys = query.split(' ').filter(v => !!v)
    const posts = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            isActive: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        ...PIPELINE_USER,
        ...PIPELINE_COMMUNITY
      ])
      .toArray()
    const results = posts
      .map(post => {
        const { title, content, keywords } = post
        const convertTitle = title.toLowerCase().split(' ')
        const titlePoint =
          keys.filter(key => convertTitle.includes(key)).length * 0.3
        console.log('PostResolver -> searchAllPosts -> titlePoint', titlePoint)
        const contentPoint =
          keys.filter(key => content.toLowerCase().includes(key)).length * 0.3
        console.log(
          'PostResolver -> searchAllPosts -> contentPoint',
          contentPoint
        )
        let keywordPoint = 0
        console.log(
          'PostResolver -> searchAllPosts -> keywordPoint',
          keywordPoint
        )
        keywords?.map(keyword => {
          const convertKeyword = keyword.toLowerCase().split(' ')
          const point =
            keys.filter(key => convertKeyword.includes(key)).length * 0.4
          keywordPoint = point > keywordPoint ? point : keywordPoint
        })
        const totalPoint = titlePoint + contentPoint + keywordPoint
        if (totalPoint > 0) {
          return {
            post,
            point: totalPoint
          }
        }
      })
      .filter(v => !!v)
      .sort((a, b) => b.point - a.point)
      .map(v => v.post)
    return results
  }
}
