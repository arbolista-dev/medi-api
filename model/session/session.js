import db from '../../db/config'

class Session {

  constructor(props) {
    this.user_id = props.user_id
    this.status = props.status
    this.duration_planned = props.duration_planned
    this.duration_success = props.duration_success
    this.note = props.note
  }

  create() {
    return db.one('INSERT INTO sessions (user_id, status, duration_planned, note) VALUES ($1, $2, $3, $4) RETURNING id', [this.user_id, this.status, this.duration_planned, this.note])
      .then((data) => {
        console.log('Created session:', data)
        return data
      }).catch((error) => {
        return error
      })
  }

}

export default Session
