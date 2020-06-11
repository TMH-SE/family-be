import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'

@Entity('communities')
export class CommunityEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  name: string

  @Expose()
  @Column()
  avatar: string

  @Expose()
  @Column()
  coverPhoto: string

  @Expose()
  @Column()
  createdAt: number

  @Expose()
  @Column()
  createdBy: string

  @Expose()
  @Column()
  updatedAt: number

  @Expose()
  @Column()
  updatedBy: string

  @Expose()
  @Column()
  deletedAt: number

  @Expose()
  @Column()
  deletedBy: string

  @Expose()
  @Column()
  isActive: boolean

  constructor(community: Partial<CommunityEntity>) {
		if (community) {
			Object.assign(
				this,
				plainToClass(CommunityEntity, community, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = +new Date()
      this.isActive = this.isActive === undefined ? true : this.isActive
		}
	}

}