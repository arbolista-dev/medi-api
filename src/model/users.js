import db from './db'
import jsonwebtoken from 'jsonwebtoken'

var bcrypt = require('bcrypt')
require('dotenv').load()

class User {

  get(id) {
    if (id) {
      return db.any('SELECT * FROM users WHERE id= $1', id)
        .then((data) => {
          console.log('Get user', data)
          return data
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
            return
          } else {
            return data
          }
        })
        .catch((error) => {
          return new Error('Specified user not found.')
        })
    } else {
      return new Error('No email address specified.')
    }
  }

  add(data) {
    return this.hashPassword(data.password).then(hash => {
      return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id', [data.email, data.first_name, data.last_name, hash])
        .then((user) => {
          let result = {}
          result.id = user.id
          result.token = this.generateJwt(user.id, data)
          console.log('Created user: ', result)
          return result
        })
        .catch((error) => {
          switch (error.code) {
          case '23505':
            return new Error('User already exists.')
          case '23502':
            return new Error('Required field ' + error.column + ' not given')
          }
        })
    }).catch((error) => {
      return error
    })
  }

  beforeUpdate(data) {
    if (data.password) {
      return this.hashPassword(data.password).then(hash => {
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
        console.log('Updated user:', result.rows)
        return result.rows[0]
      })
      .catch((error) => {
        return new Error('User update error: ', error)
      })
  }

  delete(id) {
    return db.result('DELETE FROM users WHERE id = $1', id)
      .then((result) => {
        console.log('Deleted user with ID:', id)
        return result
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
            return this.getHashByUserId(user[0].id)
              .then((hash) => {
                return this.checkPassword(hash, req.password)
                  .then((status) => {
                    console.log('Password is correct? ', status)
                    if (status) {
                      let result = {}
                      result.token = this.generateJwt(user.id, user)
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

  hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(err)
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return reject(err)
          console.log("Hashed password: ", hash)
          return resolve(hash)
        })
      })
    })
  }

  getHashByUserId(user_id) {
    return db.any('SELECT hash FROM users WHERE id= $1', user_id)
      .then((hash) => {
        return hash[0].hash
      })
      .catch((error) => {
        return new Error('User or corresponding password not found.')
      })
  }

  checkPassword(hash, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }

  generateJwt(id, data) {
    let expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)
    let full_name = data.first_name + ' ' + data.last_name

    return jsonwebtoken.sign({
      _id: id,
      email: data.email,
      name: full_name,
      exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET)
  }
}

export default User
