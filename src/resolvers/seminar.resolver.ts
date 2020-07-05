import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { SeminarEntity, UserEntity } from '@entities'
import { PIPELINE_USER } from '@constants'
import { NewSeminar } from '@generator'
import { ForbiddenError } from 'apollo-server-express'

@Resolver()
export class SeminarResolver {
  @Query()
  async seminars() {
    const results = await getMongoRepository(SeminarEntity)
      .aggregate([
        {
          $match: {
            // $expr: {
            //   $eq: ['isActive', true]
            // }
            isActive: true,
            startAt: { $gte: +new Date().setHours(0, 0, 0) }
          }
        },
        ...PIPELINE_USER
      ])
      .toArray()
    return results
  }

  @Query()
  async seminar(@Args('_id') _id: string) {
    const results = await getMongoRepository(SeminarEntity)
      .aggregate([
        {
          $match: {
            _id
          }
        },
        ...PIPELINE_USER
      ])
      .toArray()
    return results[0]
  }

  @Mutation()
  async createSeminar(
    @Context('currentUser') currentUser: UserEntity,
    @Args('newSeminar') newSeminar: NewSeminar
  ) {
    const createdSeminar = await getMongoRepository(SeminarEntity).save(
      new SeminarEntity({ ...newSeminar, createdBy: currentUser._id })
    )
    return !!createdSeminar
  }

  @Mutation()
  async updateSeminar(
    @Context('currentUser') currentUser: UserEntity,
    @Args('_id') _id: string,
    @Args('newSeminar') newSeminar: NewSeminar
  ) {
    const repository = getMongoRepository(SeminarEntity)
    const seminarFound = await repository.findOne({ _id })
    if (!seminarFound) {
      throw new ForbiddenError('Không tìm thấy hội thảo')
    }
    const updatedSeminar = await repository.save(
      new SeminarEntity({ ...seminarFound, ...newSeminar, updatedAt: +new Date(), updatedBy: currentUser._id })
    )
    return !!updatedSeminar
  }

  @Mutation()
  async deleteSeminar(
    @Context('currentUser') currentUser: UserEntity,
    @Args('_id') _id: string
  ) {
    const repository = getMongoRepository(SeminarEntity)
    const seminarFound = await repository.findOne({ _id })
    if (!seminarFound) {
      throw new ForbiddenError('Không tìm thấy hội thảo')
    }
    const deletedSeminar = await repository.save(
      new SeminarEntity({ ...seminarFound, isActive: false, deletedAt: +new Date(), deletedBy: currentUser._id })
    )
    return !!deletedSeminar
  }
}
