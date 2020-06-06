import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'
import { Expert } from '@generator'

@Entity('users')
export class UserEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  password: string

  @Expose()
  @Column()
  firstname: string

  @Expose()
  @Column()
  lastname: string

  @Expose()
  @Column()
  email: string

  @Expose()
  @Column()
  gender: string

  @Expose()
  @Column()
  phoneNumber: string

  @Expose()
  @Column()
  birthday: number

  @Expose()
  @Column()
  avatar: string

  @Expose()
  @Column()
  coverPhoto: string

  @Expose()
  @Column()
  expert: Expert

  @Expose()
  @Column()
  verified: boolean

  @Expose()
  @Column()
  createdAt: number

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

  constructor(user: Partial<UserEntity>) {
		if (user) {
			Object.assign(
				this,
				plainToClass(UserEntity, user, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = +new Date()
      this.updatedAt = +new Date()
      this.verified = this.verified === undefined ? false : this.verified
      this.isActive = this.isActive === undefined ? true : this.isActive
		}
	}

}