import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { CommunityEntity, UserEntity } from '@entities'
import { NewCommunity } from '@generator'
import { PIPELINE_USER } from '@constants'
import { UserInputError, ForbiddenError } from 'apollo-server-express'
import { CommunityUserResolver } from './communityUser.resolver'
import { PostResolver } from './post.resolver'

@Resolver()
export class CommunityResolver {
  @Query()
  async communities() {
    const results = await getMongoRepository(CommunityEntity)
      .aggregate([{ $match: { isActive: true } }, ...PIPELINE_USER])
      .toArray()
    return results
  }

  @Query()
  async communityById(@Args('id') id: string) {
    const results = await getMongoRepository(CommunityEntity)
      .aggregate([{ $match: { isActive: true, _id: id } }, ...PIPELINE_USER])
      .toArray()
    return results[0]
  }

  @Mutation()
  async createCommunity(
    @Context('currentUser') currentUser: UserEntity,
    @Args('newCommunity') newCommunity: NewCommunity
  ) {
    const communityRepository = getMongoRepository(CommunityEntity)
    const communityFound = await communityRepository.findOne({
      name: newCommunity.name
    })
    if (!!communityFound) {
      throw new ForbiddenError('Cộng đồng này đã tồn tại')
    }
    const createdCommunity = await communityRepository.save(
      new CommunityEntity({ ...newCommunity, createdBy: currentUser._id })
    )
    return createdCommunity?._id
  }

  @Mutation()
  async updateCommunity(
    @Context('currentUser') currentUser: UserEntity,
    @Args('_id') _id: string,
    @Args('newCommunity') newCommunity: NewCommunity
  ) {
    const communityRepository = getMongoRepository(CommunityEntity)
    const communityFound = await communityRepository.findOne({ _id })
    if (!communityFound) {
      throw new UserInputError('Không tìm thấy cộng đồng')
    }
    const conflictCommunity = await communityRepository.findOne({
      where: {
        _id: { $ne: _id },
        name: newCommunity.name
      }
    })
    if (!!conflictCommunity) {
      throw new ForbiddenError('Cộng đồng này đã tồn tại')
    }
    const updatedCommunity = await communityRepository.save(
      new CommunityEntity({
        ...communityFound,
        ...newCommunity,
        updatedBy: currentUser._id,
        updatedAt: +new Date()
      })
    )
    return !!updatedCommunity
  }

  @Mutation()
  async deleteCommunities(
    @Context('currentUser') currentUser: UserEntity,
    @Args('ids') ids: string[]
  ) {
    const communityRepository = getMongoRepository(CommunityEntity)
    const communitiesFound = await communityRepository.find({
      where: {
        _id: { $in: ids }
      }
    })
    const deletedCommunities = communitiesFound.map(
      community =>
        new CommunityEntity({
          ...community,
          isActive: false,
          deletedAt: +new Date(),
          deletedBy: currentUser._id
        })
    )
    const deleted = await communityRepository.save(deletedCommunities)
    return !!deleted
  }
}
