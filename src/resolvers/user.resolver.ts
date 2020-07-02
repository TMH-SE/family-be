/* eslint-disable @typescript-eslint/camelcase */
import {
  ForbiddenError,
  AuthenticationError,
  ApolloError
} from 'apollo-server-express'
import { Resolver, Args, Mutation, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import Axios from 'axios'
import { OAuth2Client } from 'google-auth-library'
import { AuthService } from '@auth'
import {
  NewUser,
  AuthRespone,
  FacebookAuthData,
  EditUser,
  UserInfo,
  NewAdmin,
  Role
} from '@generator'
import { UserEntity } from '@entities'
import { PasswordUtils, Mailer } from '@utils'
import { FB_GRAPH_API_HOST, FB_GRAPH_API_VER } from '@constants'
import { GOOGLE_CLIENT_ID } from '@environment'
import { TemplateEmail } from '@common'
// import { FB_APP_ID, FB_APP_SECRET } from '@environment'

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordUtils: PasswordUtils,
    private readonly mailer: Mailer
  ) {}

  @Query()
  async me(@Context('currentUser') currentUser: UserEntity) {
    return currentUser
  }

  @Mutation()
  async signUp(
    @Context('req') req: any,
    @Args('newUser') newUser: NewUser
  ): Promise<boolean> {
    const userRepository = getMongoRepository(UserEntity)
    const userFound = await userRepository.findOne({
      email: newUser.email
    })

    if (!!userFound) {
      throw new ForbiddenError('Email has already been registered!')
    }

    const hashedPassword = await this.passwordUtils.hashPassword(
      newUser.password
    )

    const userCreated = await userRepository.save(
      new UserEntity({
        ...newUser,
        password: hashedPassword
      })
    )
    if (!!userCreated) {
      const verifyToken = await this.authService.generateVerifyToken(
        userCreated._id
      )
      this.mailer.sendMail(
        TemplateEmail.VERIFY_ACCOUNT,
        'XÁC MINH TÀI KHOẢN - GIADINH.TK',
        [newUser.email],
        {
          name: newUser.firstname,
          link: `${req.headers.origin}/verify/${verifyToken}`
        }
      )
    }
    return !!userCreated
  }

  @Mutation()
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthRespone> {
    const userFound = await getMongoRepository(UserEntity).findOne({
      email,
      isActive: true
    })
    if (!userFound) {
      throw new AuthenticationError('Email này chưa được đăng kí')
    }
    if (!userFound.verified) {
      throw new AuthenticationError('Tài khoản này chưa được xác minh')
    }
    const match = await this.passwordUtils.comparePassword(
      password,
      userFound.password
    )
    if (!match) {
      throw new AuthenticationError('Email hoặc mật khẩu không đúng')
    }
    const accessToken = await this.authService.generateToken(userFound._id)
    return { accessToken }
  }

  @Mutation()
  async signInWithFacebook(
    @Args('facebookAuthData') facebookAuthData: FacebookAuthData
  ): Promise<AuthRespone> {
    const userRepository = getMongoRepository(UserEntity)
    const FB_GRAPH_API_URL = `${FB_GRAPH_API_HOST}/${FB_GRAPH_API_VER}`
    const req = await Axios.get(
      `${FB_GRAPH_API_URL}/${facebookAuthData.userID}?fields=name,first_name,last_name,middle_name,email,picture&access_token=${facebookAuthData.accessToken}`
    )
    const userData = req.data
    const userFound = await userRepository.findOne({ email: userData.email })
    if (userFound) {
      const accessToken = await this.authService.generateToken(userFound._id)
      return { accessToken }
    } else {
      const userCreated = await userRepository.save(
        new UserEntity({
          email: userData.email,
          firstname: userData.first_name,
          lastname: userData.middle_name
            ? `${userData.last_name} ${userData.middle_name}`
            : userData.last_name,
          avatar: userData.picture.data.url
        })
      )
      if (!!userCreated._id) {
        const accessToken = await this.authService.generateToken(
          userCreated._id
        )
        return { accessToken }
      }
    }
  }

  @Mutation()
  async signInWithGoogle(@Args('token') token: string): Promise<AuthRespone> {
    const userRepository = getMongoRepository(UserEntity)
    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
    const authRespone = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    })
    const { email, given_name, family_name, picture } = authRespone.getPayload()
    const userFound = await userRepository.findOne({ email })
    if (userFound) {
      const accessToken = await this.authService.generateToken(userFound._id)
      return { accessToken }
    } else {
      const userCreated = await userRepository.save(
        new UserEntity({
          email: email,
          firstname: given_name,
          lastname: family_name,
          avatar: picture
        })
      )
      if (!!userCreated._id) {
        const accessToken = await this.authService.generateToken(
          userCreated._id
        )
        return { accessToken }
      }
    }
  }

  @Query()
  async verifyAccount(
    @Args('verifyToken') verifyToken: string
  ): Promise<AuthRespone | ApolloError> {
    try {
      const { currentUser, error } = await this.authService.verifyEmailToken(
        verifyToken
      )
      if (error) {
        return error
      }
      getMongoRepository(UserEntity).save(
        new UserEntity({
          ...currentUser,
          verified: true,
          updatedAt: +new Date(),
          updatedBy: currentUser._id
        })
      )
      const accessToken = await this.authService.generateToken(currentUser._id)
      return {
        accessToken
      }
    } catch ({ message, name }) {
      if (message === 'jwt expired') {
        return new ApolloError('Mail xác minh này đã hết hạn', name)
      }
      return new ApolloError('Mail xác minh không hợp lệ', name)
    }
  }

  @Mutation()
  async resendConfirmMail(
    @Context('req') req: any,
    @Args('email') email: string
  ): Promise<boolean> {
    const userFound = await getMongoRepository(UserEntity).findOne({ email })
    if (!userFound || userFound.verified) {
      return false
    }
    const verifyToken = await this.authService.generateVerifyToken(
      userFound._id
    )
    this.mailer.sendMail(
      TemplateEmail.VERIFY_ACCOUNT,
      'XÁC MINH TÀI KHOẢN - GIADINH.TK',
      [userFound.email],
      {
        name: userFound.firstname,
        link: `${req.headers.origin}/verify/${verifyToken}`
      }
    )
    return true
  }

  @Query()
  async getUser(@Args('userId') userId: string): Promise<UserEntity> {
    console.log(userId)
    const userRepository = getMongoRepository(UserEntity)
    const userFound = await userRepository.findOne({
      _id: userId,
      isActive: true
    })
    return userFound
      ? {
          ...userFound,
          avatar:
            userFound.avatar ||
            'https://lh3.googleusercontent.com/proxy/6C5Z-8XG57kW_mwwDGrOz6PxPeVCy8D2cdZWKafAdYfyTxWRECggO74MhJSria5djCNtW-7r5bdxfSGoZhkqSyBN34OFbpfjwrc43LbI'
        }
      : null
  }
  @Mutation()
  async updateUser(
    @Args('userId') userId: string,
    @Args('editUser') editUser: EditUser
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const userFound = await userRepository.findOne({ _id: userId })
    if (userFound)
      userRepository.save(
        new UserEntity({
          ...userFound,
          coverPhoto: editUser.coverPhoto,
          avatar: editUser.avatar
        })
      )
  }
  @Mutation()
  async updateUserInfo(
    @Args('userId') userId: string,
    @Args('userInfo') userInfor: UserInfo
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const userFound = await userRepository.findOne({ _id: userId })
    if (userFound)
      userRepository.save(
        new UserEntity({
          ...userFound,
          ...userInfor,
          expert: userFound?.expert?.isVerify ? {...userFound.expert} : {...userInfor.expert}

        })
      )
      console.log(userFound)
    return !!userFound
  }

  @Mutation()
  async deleteUser(@Args('userId') userId: string) {
    let userDel
    const userRepository = getMongoRepository(UserEntity)
    const userFound = await userRepository.findOne({ _id: userId })
    if (userFound)
      userDel = userRepository.save(
        new UserEntity({
          ...userFound,
          isActive: false
        })
      )
    return !!userDel
  }
  @Mutation()
  async verifyOrRejectExpert(
    @Context('currentUser') currentUser: UserEntity,
    @Args('userId') userId: string,
    @Args('isVerify') isVerify: boolean
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const foundUser = await userRepository.findOne({
      _id: userId,
      isActive: true
    })
    const result = await userRepository.save(
      new UserEntity({
        ...foundUser,
        expert: { ...foundUser.expert, isVerify }
      })
    )
    return !!result
  }
  @Mutation()
  async createAdmin(
    @Context('currentUser') currentUser: UserEntity,
    @Args('newAdmin') newAdmin: NewAdmin
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const foundUser = await userRepository.findOne({ email: newAdmin.email })
    if (foundUser) {
      if (foundUser.isActive === false) {
        throw new ForbiddenError('Email này đã bị khóa')
      }
      if (foundUser.role !== Role.ADMIN) {
        throw new ForbiddenError('Admin này đã tồn tại')
      }
      const hashedPassword = await this.passwordUtils.hashPassword(
        newAdmin.password
      )
      const result = await userRepository.save(
        new UserEntity({
          ...foundUser,
          ...newAdmin,
          password: hashedPassword,
          role: Role.ADMIN,
          verified: true,
          updatedAt: +new Date(),
          updatedBy: currentUser._id
        })
      )
      return !!result
    } else {
      const hashedPassword = await this.passwordUtils.hashPassword(
        newAdmin.password
      )
      const result = await userRepository.save(
        new UserEntity({
          ...newAdmin,
          verified: true,
          password: hashedPassword,
          role: Role.ADMIN
        })
      )
      return !!result
    }
  }

  @Mutation()
  async updateAdmin(
    @Context('currentUser') currentUser: UserEntity,
    @Args('_id') _id: string,
    @Args('newAdmin') newAdmin: NewAdmin
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const foundUser = await userRepository.findOne({
      _id,
      role: Role.ADMIN,
      isActive: true
    })
    if (!foundUser) {
      throw new ForbiddenError('Admin không tồn tại')
    }
    let hashedPassword = foundUser.password
    if (newAdmin.password) {
      hashedPassword = await this.passwordUtils.hashPassword(newAdmin.password)
    }
    const result = await userRepository.save(
      new UserEntity({
        ...foundUser,
        ...newAdmin,
        password: hashedPassword,
        updatedAt: +new Date(),
        updatedBy: currentUser._id
      })
    )
    return !!result
  }

  @Mutation()
  async deleteAdmins(
    @Context('currentUser') currentUser: UserEntity,
    @Args('ids') ids: string[]
  ) {
    const userRepository = getMongoRepository(UserEntity)
    const admins = await userRepository.find({
      where: {
        _id: { $in: ids }
      }
    })
    const deleteAdmins = admins.map(
      admin =>
        new UserEntity({
          ...admin,
          isActive: false,
          deletedAt: +new Date(),
          deletedBy: currentUser._id
        })
    )
    const results = await userRepository.save(deleteAdmins)
    return results.length === deleteAdmins.length
  }

  @Query()
  async admins() {
    const result = await getMongoRepository(UserEntity).find({
      role: Role.ADMIN,
      isActive: true
    })
    return result
  }

  @Query()
  async admin(@Args('_id') _id: string) {
    const result = await getMongoRepository(UserEntity).findOne({
      _id,
      role: Role.ADMIN,
      isActive: true
    })
    return result
  }
}
