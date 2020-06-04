import * as jwt from 'jsonwebtoken'
import { JWT_SECRECT_KEY, JWT_VERIFY_EMAIL_SECRECT_KEY } from '@environment'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express'
import { UserEntity } from '@entities'

export class AuthService {
  async verifyToken(token: string) {
    const decoded = await jwt.verify(token, JWT_SECRECT_KEY)
    const { userId } = decoded
    const user = await getMongoRepository(UserEntity).findOne({ _id: userId })
    if (!user) {
      throw new AuthenticationError('Token của bạn không hợp lệ!')
    }
    return { currentUser: user }
  }

  async generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRECT_KEY, {
      expiresIn: '30d'
    })
  }

  async generateVerifyToken(userId: string) {
    return jwt.sign({ userId }, JWT_VERIFY_EMAIL_SECRECT_KEY, {
      expiresIn: '1d'
    })
  }

  async verifyEmailToken(token: string) {
    try {
      const decoded = await jwt.verify(token, JWT_VERIFY_EMAIL_SECRECT_KEY)
      const { userId } = decoded
      const user = await getMongoRepository(UserEntity).findOne({ _id: userId })
      if (!user) {
        return { error: new AuthenticationError('Token của bạn không hợp lệ!') }
      }
      if (user.verified) {
        return { error: new ForbiddenError('Tài khoản này đã được xác nhận') }
      }
      return { currentUser: user }
    } catch (error) {
      throw error
    }
  }
}
