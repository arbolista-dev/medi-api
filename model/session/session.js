import db from '../../db/config'
import { stringDatetoInt } from './session.helper'

class Session {

  constructor(props) {
    this.user_id = props.user_id
    this.status = props.status
    this.date = stringDatetoInt(props.date)
    this.duration_planned = props.duration_planned
    this.duration_success = props.duration_success
    this.location = props.location
    this.note = props.note
  }

  create() {
    return db.one('INSERT INTO sessions (user_id, status, date, duration_planned, duration_success, location, note) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [this.user_id, this.status, this.date, this.duration_planned, this.duration_success, this.location, this.note])
              .then((data) => {
                console.log('Created session:', data)
                return data
              }).catch((error) => {
                return error
              })
  }
}

export default Session
