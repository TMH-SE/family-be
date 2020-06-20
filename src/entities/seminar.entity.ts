import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'

@Entity('seminars')
export class SeminarEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  title: string

  @Expose()
  @Column()
  description: string

  @Expose()
  @Column()
  startAt: number

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

  constructor(seminar: Partial<SeminarEntity>) {
		if (seminar) {
			Object.assign(
				this,
				plainToClass(SeminarEntity, seminar, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = +new Date()
      this.isActive = this.isActive === undefined ? true : this.isActive
		}
	}

}