import { Resolver, Mutation } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { UserEntity, PostEntity, SeminarEntity } from '@entities'
import { Role } from '@generator'
import firebase from 'firebase'

const groupBy = (array: any[], key: string) =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: { ...(objectsByKeyValue[obj[key]] || {}), ...obj }
    }),
    {}
  )

const handleData = (raw: any, type: string) => {
  const dayOfYear = Math.floor(
    (+new Date() - +new Date(new Date().getFullYear(), 0, 0)) /
      1000 /
      60 /
      60 /
      24
  )
  const updateData = {}
  for (let i = 13; i >= 0; i--) {
    const date = new Date(new Date().setDate(new Date().getDate() - i))
    updateData[dayOfYear - i] = raw[dayOfYear - i] || {
      _id: dayOfYear - i,
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      count: 0,
      type
    }
  }
  return Object.values(updateData).map((data: any) => ({
    ...data,
    date: `${data.date.day}/${data.date.month}/${data.date.year}`
  }))
}

const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_API_KEY || 'AIzaSyAzni8DvqLlDB_rnt1nxtCpIEeHocXHaZA',
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN ||
    'graduation-project-2020.firebaseapp.com',
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    'https://graduation-project-2020.firebaseio.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'graduation-project-2020',
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ||
    'graduation-project-2020.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '950930789819',
  appId:
    process.env.FIREBASE_APP_ID || '1:950930789819:web:b54a53c02ebdcf7e59609e',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-MPT0K7B144'
}

@Resolver('Report')
export class ReportResolver {
  @Mutation()
  async refreshDataReport() {
    const resultUsers = await getMongoRepository(UserEntity)
      .aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$isActive', true] },
                { $eq: ['$role', Role.MEMBER] },
                {
                  $gte: [
                    '$createdAt',
                    new Date(
                      new Date().setDate(new Date().getDate() - 14)
                    ).setHours(0, 0, 0, 0)
                  ]
                }
              ]
            }
          }
        },
        {
          $addFields: {
            convertDate: { $toDate: '$createdAt' }
          }
        },
        {
          $group: {
            _id: { $dayOfYear: '$convertDate' },
            date: {
              $first: {
                year: { $year: '$convertDate' },
                month: { $month: '$convertDate' },
                day: { $dayOfMonth: '$convertDate' }
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $addFields: {
            type: 'user'
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      .toArray()

    const resultPosts = await getMongoRepository(PostEntity)
      .aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$isActive', true] },
                {
                  $gte: [
                    '$createdAt',
                    new Date(
                      new Date().setDate(new Date().getDate() - 14)
                    ).setHours(0, 0, 0, 0)
                  ]
                }
              ]
            }
          }
        },
        {
          $addFields: {
            convertDate: { $toDate: '$createdAt' }
          }
        },
        {
          $group: {
            _id: { $dayOfYear: '$convertDate' },
            date: {
              $first: {
                year: { $year: '$convertDate' },
                month: { $month: '$convertDate' },
                day: { $dayOfMonth: '$convertDate' }
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $addFields: {
            type: 'post'
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      .toArray()

    const resultSeminars = await getMongoRepository(SeminarEntity)
      .aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$isActive', true] },
                {
                  $gte: [
                    '$createdAt',
                    new Date(
                      new Date().setDate(new Date().getDate() - 14)
                    ).setHours(0, 0, 0, 0)
                  ]
                }
              ]
            }
          }
        },
        {
          $addFields: {
            convertDate: { $toDate: '$createdAt' }
          }
        },
        {
          $group: {
            _id: { $dayOfYear: '$convertDate' },
            date: {
              $first: {
                year: { $year: '$convertDate' },
                month: { $month: '$convertDate' },
                day: { $dayOfMonth: '$convertDate' }
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $addFields: {
            type: 'seminar'
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      .toArray()
    const dataUserHandled = handleData(groupBy(resultUsers, '_id'), 'user')
    const dataPostHandled = handleData(groupBy(resultPosts, '_id'), 'post')
    const dataSeminarHandled = handleData(
      groupBy(resultSeminars, '_id'),
      'seminar'
    )
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig)
    }
    firebase
      .database()
      .ref(`report`)
      .set({lastDays: dataUserHandled.concat(dataPostHandled).concat(dataSeminarHandled), updatedAt: +new Date()})

    return true
  }
}
