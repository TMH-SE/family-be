import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { SeminarEntity, UserEntity } from '@entities'
import { PIPELINE_USER } from '@constants'
import { NewSeminar } from '@generator'

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
}
