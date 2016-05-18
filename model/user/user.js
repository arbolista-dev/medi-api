import db from '../../db/config'
import { hashPassword, generateJwt } from './user.helper'

class User {

  constructor(props) {
    this.email = props.email
    this.first_name = props.first_name
    this.last_name = props.last_name
    this.password = props.password
  }

  create() {
    return hashPassword(this.password).then(hash => {
      return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name', [this.email, this.first_name, this.last_name, hash])
        .then((result) => {
          let user = {}
          user = result
          let payload = { first_name: this.first_name, last_name: this.last_name }
          user.token = generateJwt(result.id, payload)
          console.log('Created user: ', user)
          return user
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
}

export default User
