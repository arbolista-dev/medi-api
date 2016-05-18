import User from '../model/user/user'
import Session from '../model/session/session'
import users from './seeds/user.json'
import sessions from './seeds/session.json'

users.forEach((user_args) => {
  let user = new User(user_args)
  user.create()
})

sessions.forEach((session_args) => {
  let session = new Session(session_args)
  session.create()
})
