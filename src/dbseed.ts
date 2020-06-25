import * as uuid from 'uuid'
import { MongoClient } from 'mongodb'
import { hash } from 'bcrypt'
import { MONGODB_URL } from './environment'

async function dbseed() {
  console.log('Database seeding...')
  const client = new MongoClient(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await client.connect()
  const db = client.db().collection('users')
  const foundSuper = await db.findOne({ email: 'superadminfamily' })
  if (!foundSuper) {
    const password = await hash('def4u1tP4ssVV0rd', 10)
    const result = await db.insertMany([
      {
        _id: uuid.v1(),
        email: 'superadminfamily',
        password,
        role: 'SUPERADMIN',
        verified: true,
        isActive: true
      },
      {
        _id: uuid.v1(),
        email: 'adminhieu',
        password,
        firstname: 'Hiếu',
        lastname: 'Trần Minh',
        birthday: 883674000000,
        gender: 'MALE',
        phoneNumber: '0123456789',
        role: 'ADMIN',
        verified: true,
        isActive: true
      },
      {
        _id: uuid.v1(),
        email: 'adminnhu',
        password,
        firstname: 'Như',
        lastname: 'Hồ Trần',
        birthday: 883674000000,
        gender: 'FEMALE',
        phoneNumber: '0987654321',
        role: 'ADMIN',
        verified: true,
        isActive: true
      }
    ])
    if (result.insertedCount === 3) {
      console.log('Database seed successfully!')
      client.close()
    } else {
      console.log('Database seed failed!')
      client.close()
    }
  } else {
    console.log('Database seed completely!')
    client.close()
  }
}

dbseed()
