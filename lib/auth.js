import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import UserBase from '../model/user/user.base'
import { checkPassword } from '../model/user/user.helper'
let userBase = new UserBase()

passport.use(new LocalStrategy({usernameField: 'email'}, (username, password, done) => {
  let user_data = userBase.get(username)
  if (!user_data) {
    return done(null, false, {
      message: 'User not found'
    })
  }
  if (checkPassword(user_data.id, password)) {
    return done(null, false, {
      message: 'Incorrect password'
    })
  }
  return done(null, user_data)
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  userBase.get(id).then((user, err) => {
    return done(err, user)
  })
})
