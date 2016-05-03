import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import User from '../model/users'
let userModel = new User()

passport.use(new LocalStrategy({usernameField: 'email'}, (username, password, done) => {
  let user_data = userModel.get(username)
  if (!user_data) {
    return done(null, false, {
      message: 'User not found'
    })
  }
  if (userModel.checkPassword(user_data.id, password)) {
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
  userModel.get(id).then((user, err) => {
    return done(err, user)
  })
})
