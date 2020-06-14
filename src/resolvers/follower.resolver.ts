/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { FollowerEntity } from '@entities'
import { FollowerInput } from '@generator'

@Resolver('Follower')
export class FollowerResolver {
  @Query()
  async getSumFollowerByUser(@Args('userId') userId: string): Promise<number> {
    const followerFound = await getMongoRepository(FollowerEntity).find({
      where: {
        userId
      }
    })
    return followerFound.length
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
