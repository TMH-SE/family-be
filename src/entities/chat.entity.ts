import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'


@Entity('chats')
export class ChatEntity {
  @Expose()
  @ObjectIdColumn()
  _id: string

  @Expose()
  @Column()
  members: [string]

  @Expose()
  @Column()
  isBlock: boolean

  @Expose()
  @Column()
  lastActivity: number

  constructor(chat: Partial<ChatEntity>) {
		if (chat) {
			Object.assign(
				this,
				plainToClass(ChatEntity, chat, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
            this.isBlock = this.isBlock || false
            this.lastActivity = this.lastActivity || +new Date()
		}
	}

}