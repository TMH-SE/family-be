/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { FollowerEntity } from '@entities'
import { FollowerInput, FollowerRespone } from '@generator'
import { PIPELINE_USER } from '@constants'

@Resolver('Follower')
export class FollowerResolver {
  @Query()
  async getFollowerByUser(@Args('userId') userId: string): Promise<FollowerRespone[]> {
    const results = await getMongoRepository(FollowerEntity)
    .aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'followerId',
          foreignField: '_id',
          as: 'follower'
        }
      },
      {
        $unwind: {
          path: '$follower',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray()
   
    return results
  }

  @Query()
  async checkFollow(@Args('id') id: FollowerInput): Promise<boolean> {
    const followerFound = await getMongoRepository(FollowerEntity).findOne({
      _id: id
    })
    console.log(followerFound !== null, followerFound)
    return !!followerFound
  }
  @Mutation()
  async createFollower(@Args('id') id: FollowerInput): Promise<boolean> {
    const followerRepository = getMongoRepository(FollowerEntity)
    const followerCreated = await followerRepository.save(
      new FollowerEntity({
        _id: id,
        followerId: id.followerId,
        userId: id.userId
      })
    )
    return !!followerCreated
  }

  @Mutation()
  async deleteFollower(@Args('id') id: FollowerInput): Promise<boolean> {
    const followerRepository = getMongoRepository(FollowerEntity)
    const followerFound = await this.checkFollow(id)
    // if (!followerFound) {
    //     console.log('err')
    //     return false
    // }
    await followerRepository.deleteOne({ _id: id })
    return true
  }
}
