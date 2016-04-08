import db from './db'

class User {

  list() {
    return db.any("SELECT * FROM users;")
      .then((data) => {
        console.log('data list', data)
        return data
      })
  }

  get(id) {
    return db.any('SELECT id, email FROM users WHERE id= $1;', id)
      .then((data) => {
        console.log('user get', data)
        return data[0]
      })
  }
}

export default User
