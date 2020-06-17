import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import { SavedPostId } from '@generator'


@Entity('savedpost')
export class SavedPostEntity {
  @Expose()
  @ObjectIdColumn()
  _id: SavedPostId

  @Expose()
  @Column()
  userId: string

  @Expose()
  @Column()
  postId: string



  constructor(savedpost: Partial<SavedPostEntity>) {
		if (savedpost) {
			Object.assign(
				this,
				plainToClass(SavedPostEntity, savedpost, {
					excludeExtraneousValues: true
				})
			)
		}
	}

}