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
    if (this.password) {
      return hashPassword(this.password).then(hash => {
        return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name', [this.email, this.first_name, this.last_name, hash])
          .then((result) => {
            let user = {}
            user = result
            let payload = {
              first_name: this.first_name,
              last_name: this.last_name
            }
            user.token = generateJwt(result.id, payload)
            console.info('Created user: ', user)
            return user
          })
          .catch((err) => {
            switch (err.code) {
            case '23505':
              return new Error(JSON.stringify({
                arg: 'email',
                msg: 'non-unique'
              }))
            case '23502':
              return new Error(JSON.stringify({
                arg: err.column,
                msg: 'unspecified'
              }))
            default:
              return new Error(JSON.stringify({
                msg: 'creation-error'
              }))
            }
          })
      }).catch((error) => {
        return error
      })
    } else {
      return new Error(JSON.stringify({
        key: 'password',
        code: 'unspecified'
      }))
    }
  }
}

export default User
