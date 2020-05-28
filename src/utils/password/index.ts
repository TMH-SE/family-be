import { hash, compare } from 'bcrypt'
import { SALT_ROUNDS } from '@constants'

export class PasswordUtils {
  async hashPassword(plaintextPassword: string): Promise<string> {
    return await hash(plaintextPassword, SALT_ROUNDS)
  }

  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return await compare(password, hashPassword)
  }

  async generatePassword(length: number): Promise<string> {
    return Math.random().toString(32).slice(length * -1.0)
  }
}