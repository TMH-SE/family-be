import * as jwt from 'jsonwebtoken'
import { JWT_SECRECT_KEY } from '@environment'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError } from 'apollo-server-express'
import { UserEntity } from '@entities'

export class AuthService {
  async verifyToken(token: string) {
    const decoded = await jwt.verify(token, JWT_SECRECT_KEY)
    const { userId } = decoded
    const user = await getMongoRepository(UserEntity).findOne({ _id: userId })
    if (!user) {
      throw new AuthenticationError('Invalid token!')
    }
    return { currentUser: user }
  }

  async generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRECT_KEY, {
      expiresIn: '30d'
    })
  }
}
