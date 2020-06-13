import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import { CommunityUserId } from '@generator'


@Entity('communityUser')
export class CommunityUserEntity {
  @Expose()
  @ObjectIdColumn()
  _id: CommunityUserId

  @Expose()
  @Column()
  userId: string

  @Expose()
  @Column()
  communityId: string



  constructor(communityUser: Partial<CommunityUserEntity>) {
		if (communityUser) {
			Object.assign(
				this,
				plainToClass(CommunityUserEntity, communityUser, {
					excludeExtraneousValues: true
				})
			)
		}
	}

}