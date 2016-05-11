import db from '../../db/config'

class SessionBase {

  get(id) {
    if (id) {
      return db.any('SELECT * FROM sessions WHERE id= $1', id)
        .then((data) => {
          console.log('Get session', data)
          return data
        })
    } else {
      return db.any('SELECT * FROM sessions')
        .then((data) => {
          console.log('List sessions', data)
          return data
        })
    }
  }

  getByUser(user_id) {
    return db.any('SELECT * FROM sessions WHERE user_id= $1', user_id)
      .then((data) => {
        console.log('Get sessions for user', data)
        return data
      })
  }

  update(data) {
    console.log('data is:', data)
    return db.result('UPDATE sessions SET status = COALESCE($2, status), duration_success = COALESCE($3, duration_success) WHERE id = $1 RETURNING id, user_id, duration_success, status', [data.id, data.status, data.duration_success])
      .then((result) => {
        console.log('Updated session with ID:', result.rows)
        return result.rows[0]
      })
  }

  delete(id) {
    return db.result('DELETE FROM sessions WHERE id = $1', id)
      .then((result) => {
        console.log('Deleted session with ID:', id)
        return result
      })
  }
}

export default SessionBase
