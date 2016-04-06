import db from './db'

class User {

  list() {
    db.connect(async ({ query }) => {
      let result = await query( 'SELECT * FROM users')
      if (result.rowCount) {
        // users exist
      }
    }).catch(done)
  }

  get(id) {
    db.connect(async ({ query }) => {
      let result = await query( 'SELECT id, email FROM users WHERE id= $1;', id)
      if (result.rowCount) {
        // users exists
      }
    }).catch(done)
  }

  add(data) {
    db.connect(async ({ query }) => {
      let result = await query( 'INSERT INTO users (id, email) VALUES ($1, $2);', data.id, data.email)
      if (result.rowCount) {
        // users exists
      }
    }).catch(done)
  }

  update() {}
}

export default User
