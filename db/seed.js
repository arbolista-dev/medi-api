import db from './config'
import User from '../model/user/user'
import users from './seeds/user.json'
import Session from '../model/session/session'
import sessions from './seeds/session.json'

db.none('alter sequence users_id_seq restart with 1')
    .then(() => {
      console.log('User ID sequence got reset!')
    })
    .catch((error) => {
      console.log('Failed to reset users_id_seq!')
    })

db.none('alter sequence sessions_id_seq restart with 1')
    .then(() => {
      console.log('Session ID sequence got reset!')
    })
    .catch((error) => {
      console.log('Failed to reset sessions_id_seq!')
    })

function createUsers() {
  var user_promises = []
  users.forEach((user_args) => {
    var deferred = new Promise((resolve) => {
      let user = new User(user_args)
      user.create().then((res) => {
        resolve(res)
      })
    })
    user_promises.push(deferred)
  })

  return Promise.all(user_promises)
}

function createSessions() {
  var session_promises = []

  sessions.forEach((session_args) => {
    var deferred = new Promise((resolve) => {
      let session = new Session(session_args)
      session.create().then((res) => {
        resolve(res)
      })
    })
    session_promises.push(deferred)
  })
  return Promise.all(session_promises)
}

createUsers().then((res) => {
  console.log('Resolved user promises')
  createSessions().then((result) => {
    console.log('Resolved session promises')
  })
})
