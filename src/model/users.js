import db from './db'
var bcrypt = require('bcrypt')

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
    this.setPassword(data)
    console.log('pw to be inserted', this.hash)
    return db.one('INSERT INTO users (email, first_name, last_name, hash) VALUES ($1, $2, $3, $4) RETURNING id', [data.email, data.first_name, data.last_name, this.hash])
      .then((data) => {
        console.log('Created new user with ID:', data.id)
        return data
      })
      .catch((error) => {
        console.log(error)
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

  setPassword(data) {
    console.log('data', data)
    bcrypt.hash(data.password, 10, (err, hash) => {
        if(err) return next(err);
        console.log('hash', hash)
        return hash;
        next();
    })
  }
  checkPassword(username, password) {

  }
}

export default User
