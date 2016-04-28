import db from './db'
import jsonwebtoken from 'jsonwebtoken'
var bcrypt = require('bcrypt')
var config = require('../config/constants')

class User {

    get(id) {
        if (id) {
            return db.any('SELECT * FROM users WHERE id= $1', id)
                .then((data) => {
                    console.log('Get user', data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            return db.any('SELECT * FROM users')
                .then((data) => {
                    console.log('List users', data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    add(data) {
        return this.hashPassword(data.password).then(hash => {
            return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id', [data.email, data.first_name, data.last_name, hash])
                .then((data) => {
                    console.log('Created new user with ID:', data.id)
                    this.checkPassword(data.id, 'testtesttest')
                    return data
                })
                .catch((error) => {
                    switch (error.code) {
                      case '23505':
                        throw new Error('User already exists.')
                        break;
                      case '23502':
                        throw new Error('Required field ' + error.column + ' not given')
                        break;
                    }
                })
        }).catch((error) => {
          throw new Error('Password is required in correct format.')
        })
    }

    update(data) {
        console.log('data is:', data)
        return db.result('UPDATE users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name) WHERE id = $1 RETURNING email, id, first_name, last_name', [data.id, data.email, data.first_name, data.last_name])
            .then((result) => {
                console.log('Updated user with ID:', result.rows)
                return result.rows[0]
            })
            .catch((error) => {
                console.log(error)
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
            })
    }

    hashPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err)

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return reject(err)

                    return resolve(hash)
                })
            })
        })
    }

    checkPassword(user_id, password) {
        return db.any('SELECT hash FROM users WHERE id= $1', user_id)
            .then((hash) => {
                bcrypt.compare(password, hash[0].hash, (err, res) => {
                    if (err) return err
                    console.log('is password correct?', res)
                    return res
                })
            })
            .catch((error) => {
              throw new Error('User or corresponding password not found.')
            })
    }

    generateJwt(data) {
      let expiry = new Date()
      expiry.setDate(expiry.getDate() + 7)
      let name = data.first_name + ' ' + data.last_name
      let secret = config.dev.secret

      return jsonwebtoken.sign({
        _id: data.id,
        email: data.email,
        name: name,
        exp: parseInt(expiry.getTime() / 1000)
      }, secret)
    }
}

export default User
