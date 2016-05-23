import db from '../../db/config'
import jsonwebtoken from 'jsonwebtoken'

var bcrypt = require('bcrypt')
require('dotenv').load()

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err)
        console.info('Hashed password: ', hash)
        return resolve(hash)
      })
    })
  })
}

export function getHashByUserId(user_id) {
  return db.any('SELECT hash FROM users WHERE id= $1', user_id)
    .then((hash) => {
      return hash[0].hash
    })
    .catch(() => {
      return new Error(JSON.stringify({
        key: 'id',
        msg: 'non-existent'
      }))
    })
}

export function checkPassword(hash, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function generateJwt(id, data) {
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
