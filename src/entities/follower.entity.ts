import { Entity, ObjectIdColumn } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import {  FollowerID } from '@generator'


@Entity('followers')
export class FollowerEntity {
  @Expose()
  @ObjectIdColumn()
  _id: FollowerID


  constructor(follower: Partial<FollowerEntity>) {
		if (follower) {
			Object.assign(
				this,
				plainToClass(FollowerEntity, follower, {
					excludeExtraneousValues: true
				})
			)
        }
        this._id = this._id
	}

}