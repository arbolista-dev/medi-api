import db from '../../db/config'
import {
    hashPassword,
    getHashByUserId,
    checkPassword,
    generateJwt
} from './user.helper'


class UserBase {

  get(id) {
    if (id) {
      return db.any('SELECT * FROM users WHERE id= $1', id)
                .then((data) => {
                  if (data[0] == null) {
                    return new Error(JSON.stringify({
                      key: 'id',
                      code: 'non-existent'
                    }))
                  } else {
                    console.info('Get user', data)
                    return data
                  }
                })
                .catch(() => {
                  return new Error(JSON.stringify({
                    code: 'retrieval-error'
                  }))
                })
    } else {
      return db.any('SELECT * FROM users')
                .then((data) => {
                  console.info('List users', data)
                  return data
                })
                .catch(() => {
                  return new Error(JSON.stringify({
                    code: 'retrieval-error'
                  }))
                })
    }
  }

  getByEmail(email) {
    if (email) {
      return db.any('SELECT * FROM users WHERE email= $1', email)
                .then((data) => {
                  console.info('Get user by email', data)
                  if (data[0] == null) {
                    return new Error(JSON.stringify({
                      key: 'email',
                      code: 'non-existent'
                    }))
                  } else {
                    return data
                  }
                })
                .catch(() => {
                  return new Error(JSON.stringify({
                    code: 'retrieval-error'
                  }))
                })
    } else {
      return new Error(JSON.stringify({
        key: 'email',
        code: 'unspecified'
      }))
    }
  }

  beforeUpdate(data) {
    if (data.id === undefined) {
      return new Error(JSON.stringify({
        key: 'id',
        code: 'unspecified'
      }))
    }
    if (data.password) {
      return hashPassword(data.password).then(hash => {
        data.hash = hash
        return data
      }).catch((err) => {
        return err
      })
    }
  }

  update(data) {
    this.beforeUpdate(data)
    return db.result('UPDATE users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name), hash = COALESCE($5, hash) WHERE id = $1 RETURNING email, id, first_name, last_name', [data.id, data.email, data.first_name, data.last_name, data.hash])
            .then((result) => {
              if (result.rowCount === 0) {
                return new Error(JSON.stringify({
                  key: 'id',
                  code: 'non-existent'
                }))
              } else {
                let user = {}
                user = result.rows[0]
                let payload = {
                  first_name: result.first_name,
                  last_name: result.last_name
                }
                user.token = generateJwt(result.id, payload)
                console.info('Updated user:', user)
                return user
              }
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
                  msg: 'update-error'
                }))
              }
            })
  }

  delete(id) {
    if (id) {
      return db.result('DELETE FROM users WHERE id = $1', id)
              .then((result) => {
                if (result.rowCount === 0) {
                  return new Error(JSON.stringify({
                    key: 'id',
                    code: 'non-existent'
                  }))
                } else {
                  console.info('Deleted user with ID:', id)
                  return result
                }
              })
              .catch(() => {
                return new Error(JSON.stringify({
                  code: 'deletion-error'
                }))
              })
    } else {
      return new Error(JSON.stringify({
        arg: 'id',
        code: 'unspecified'
      }))
    }

  }

  authenticate(req) {
    if (!req.email || !req.password) {
      if (!req.email) {
        return new Error(JSON.stringify({
          key: 'email',
          code: 'unspecified'
        }))
      } else if (!req.password) {
        return new Error(JSON.stringify({
          key: 'password',
          code: 'unspecified'
        }))
      }
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
                                      console.info('Password is correct? ', status)
                                      if (status) {
                                        let result = {}
                                        result.token = generateJwt(user[0].id, user[0])
                                        console.info('User authenticated using JWT: ', result)
                                        return result
                                      } else {
                                        return new Error(JSON.stringify({
                                          key: 'password',
                                          code: 'incorrect'
                                        }))
                                      }
                                    })
                                    .catch((err) => {
                                      console.error('Password verification error: ', err)
                                      return new Error(JSON.stringify({
                                        code: 'authentication-error'
                                      }))
                                    })
                            })
                            .catch((err) => {
                              console.error('Hash retrieval error: ', err)
                              return new Error(JSON.stringify({
                                code: 'authentication-error'
                              }))
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
