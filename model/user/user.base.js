import db from '../../db/config'
import { hashPassword, getHashByUserId, checkPassword, generateJwt } from './user.helper'

class UserBase {

  get(id) {
    if (id) {
      return db.any('SELECT * FROM users WHERE id= $1', id)
        .then((data) => {
          console.log('Get user', data)
          if (data[0] == null) {
            return new Error('Specified user not found')
          } else {
            return data
          }
        })
        .catch((error) => {
          return new Error('User retrieval error: ', error)
        })
    } else {
      return db.any('SELECT * FROM users')
        .then((data) => {
          console.log('List users', data)
          return data
        })
        .catch((error) => {
          return new Error('User listing error: ', error)
        })
    }
  }

  getByEmail(email) {
    if (email) {
      return db.any('SELECT * FROM users WHERE email= $1', email)
        .then((data) => {
          console.log('Get user by email', data)
          if (data[0] == null) {
            return new Error('Specified user not found')
          } else {
            return data
          }
        })
        .catch((error) => {
          return new Error('Error getting user by email.')
        })
    } else {
      return new Error('No email address specified.')
    }
  }

  beforeUpdate(data) {
    if (data.password) {
      return hashPassword(data.password).then(hash => {
        data.hash = hash
        return data
      }).catch((error) => {
        return error
      })
    }
  }

  update(data) {
    this.beforeUpdate(data)
    return db.result('UPDATE users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name), hash = COALESCE($5, hash) WHERE id = $1 RETURNING email, id, first_name, last_name', [data.id, data.email, data.first_name, data.last_name, data.hash])
      .then((result) => {
        if(result.rowCount === 0) {
          return new Error('User does not exist.')
        } else {
          let user = {}
          console.log(result.rows[0])
          user = result.rows[0]
          let payload = { first_name: result.first_name, last_name: result.last_name }
          user.token = generateJwt(result.id, payload)
          console.log('Updated user:', user)
          return user
        }
      })
      .catch((error) => {
        return new Error('User update error: ', error)
      })
  }

  delete(id) {
    return db.result('DELETE FROM users WHERE id = $1', id)
      .then((result) => {
        if(result.rowCount === 0) {
          return new Error('User does not exist.')
        } else {
          console.log('Deleted user with ID:', id)
          return result
        }
      })
      .catch((error) => {
        console.log(error)
        return new Error('User deletion error: ', error)
      })
  }

  authenticate(req) {
    console.log('model auth user: ', req)
    if (!req.email || !req.password) {
      return new Error('All fields required.')
    } else {
      return this.getByEmail(req.email)
        .then((user) => {
          if (!user[0]) {
            // User does not exist, return error
            return user
          } else {
            return getHashByUserId(user[0].id)
              .then((hash) => {
                return checkPassword(hash, req.password)
                  .then((status) => {
                    console.log('Password is correct? ', status)
                    if (status) {
                      let result = {}
                      result.token = generateJwt(user.id, user)
                      console.log('User authenticated using JWT: ', result)
                      return result
                    } else {
                      return new Error('Incorrect password.')
                    }
                  })
                  .catch((error) => {
                    return new Error('Password verification error: ', error)
                  })
              })
              .catch((error) => {
                return new Error('Hash retrieval error: ', error)
              })
          }
        })
        .catch((error) => {
          return error
        })
    }
  }
}

export default UserBase
