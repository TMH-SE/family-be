import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'

@Entity('posts')
export class PostEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  title: string

  @Expose()
  @Column()
  content: string

  @Expose()
  @Column()
  thumbnail: string

  @Expose()
  @Column()
  keywords: string[]

  @Expose()
  @Column()
  communityId: string

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

  constructor(post: Partial<PostEntity>) {
		if (post) {
			Object.assign(
				this,
				plainToClass(PostEntity, post, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = +new Date()
      this.isActive = this.isActive === undefined ? true : this.isActive
		}
	}

}