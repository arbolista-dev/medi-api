import db from './db'

class User {

  list() {
    db.connect(async ({ query }) => {
      let result = await query('SELECT * FROM users;')
      console.log('User list: ', result)
      if (result.rowCount) {
        console.log('User list if: ', result)
      }
    })
  }

  get(id) {
    db.connect(async ({ query }) => {
      let result = await query('SELECT id, email FROM users WHERE id= $1;', id)
      if (result.rowCount) {
        console.log('User get: ', result)
      }
    })
  }

  add(data) {
    db.connect(async ({ query }) => {
      let result = await query('INSERT INTO users (id, email) VALUES ($1, $2);', data.id, data.email)
      if (result.rowCount) {
        console.log('User add: ', result)
      }
    })
  }
}

export default User
