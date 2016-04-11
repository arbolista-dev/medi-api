import db from './db'

class User {

  get(id) {
    if (id) {
      return db.any('SELECT * FROM users WHERE id= $1', id)
        .then((data) => {
          console.log('Get user', data)
          return data
        })
    } else {
      return db.any('SELECT * FROM users')
        .then((data) => {
          console.log('List users', data)
          return data
        })
    }
  }

  add(data) {
    return db.one('INSERT INTO users (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING id', [data.email, data.first_name, data.last_name])
      .then((data) => {
        console.log('Created new user with ID:', data.id)
        return data
      })
  }

  update(data) {
    console.log('data is:', data)
    return db.result('UPDATE users SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name) WHERE id = $1 RETURNING email, id, first_name, last_name', [data.id, data.email, data.first_name, data.last_name])
      .then((result) => {
        console.log('Updated user with ID:', result.rows)
        return result.rows[0]
      })
  }

  delete(id) {
    return db.result('DELETE FROM users WHERE id = $1', id)
      .then((result) => {
        console.log('Deleted user with ID:', id)
        return result
      })
  }
}

export default User
