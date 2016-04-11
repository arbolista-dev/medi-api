import db from './db'

class User {

  get(id) {
    if (id) {
      return db.any('SELECT id, email FROM users WHERE id= $1;', id)
        .then((data) => {
          console.log('user get', data)
          return data
        })
    } else {
      return db.any("SELECT * FROM users;")
        .then((data) => {
          console.log('data list', data)
          return data
        })
    }
  }

  add(data) {
    console.log('Adding user with these parameters:', data)
    return db.one('INSERT INTO users (email) VALUES ($1) RETURNING id;', data.email)
      .then((data) => {
        console.log('Created new user with ID:', data.id)
        return data.id
      })
  }
}

export default User
