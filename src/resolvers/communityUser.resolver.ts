/* eslint-disable @typescript-eslint/camelcase */
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { PIPELINE_USER, PIPELINE_COMMUNITY } from '@constants'
import { CommunityUserInput } from '@generator'
import { CommunityUserEntity } from '@entities'

@Resolver('CommunityUser')
export class CommunityUserResolver {
  @Query()
  async getMembersByCommunity(@Args('communityId') communityId: string) {
    const communityUserFound = await getMongoRepository(CommunityUserEntity).aggregate([
      {
        $match: {
          communityId: communityId
        }
      },
      ...PIPELINE_USER,
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return communityUserFound ? communityUserFound.length : 0
  }
  @Query()
  async getCommunitiesByUser(@Args('userId') userId: string) {
    const communityUserFound = await getMongoRepository(CommunityUserEntity).aggregate([
      {
        $match: {
          userId: userId
        }
      },
      ...PIPELINE_COMMUNITY
    ]).toArray()
    return communityUserFound
  }
  @Query()
  async checkIsMember(@Args('id') id: CommunityUserInput): Promise<boolean> {
    const communityUserFound = await getMongoRepository(CommunityUserEntity).findOne({
      _id: id
    })
    return !!communityUserFound
  }
  @Mutation()
  async createAndDeleteMember(
    @Args('id') id: CommunityUserInput
  ): Promise<boolean> {
    const communityUserRepository = getMongoRepository(CommunityUserEntity)
    const communityUserFound = await this.checkIsMember(id)
    if (communityUserFound) {
      await communityUserRepository.findOneAndDelete({ _id: id })
    } else {
      await communityUserRepository.save(
        new CommunityUserEntity({
          _id: id,
          userId: id.userId,
          communityId: id.communityId
        })
      )
    }
    return true
  }
  @Mutation()
  async deleteAllMembers(): Promise<boolean> {
    await getMongoRepository(CommunityUserEntity).deleteMany({})
    return true
  }
}
