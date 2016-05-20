import db from '../../db/config'
import { intToDateString, stringDateToInt } from './session.helper'

class SessionBase {

  get(args) {
    if (args.id) {
      return this.getByID(args.id)
    } else if(args.user_id) {
      return this.getByUser(args.user_id, args.start_date, args.end_date)
    } else {
      return this.getAll(args.start_date, args.end_date)
    }
  }

  getByID(id) {
    return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE id= $1', id)
      .then((data) => {
        if (data[0] == null) {
          return new Error('Specified session not found')
        } else {
          console.log('Get session', data)
          return data
        }
      })
      .catch((error) => {
        console.log(error)
        return new Error('Session retrieval error: ', error)
      })
  }

  getByUser(user_id, start, end) {
    if (start && end) {
      let _start = stringDateToInt(start)
      let _end = stringDateToInt(end)
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE user_id= $1 AND date >= $2 AND date <= $3', [user_id, _start, _end])
        .then((data) => {
          console.log('Get sessions for user', data)
          return data
        })
        .catch((error) => {
          return new Error('Error getting sessions by user: ', error)
        })
    } else {
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE user_id= $1', user_id)
        .then((data) => {
          console.log('Get sessions for user', data)
          return data
        })
        .catch((error) => {
          return new Error('Error getting sessions by user: ', error)
        })
    }
  }

  getAll(start, end) {
    if (start && end) {
      let _start = stringDateToInt(start)
      let _end = stringDateToInt(end)
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE date >= $1 AND date <= $2', [_start, _end])
        .then((data) => {
          console.log('List session within date range', data)
          if (data[0] == null) {
            return new Error('Specified session not found')
          } else {
            return data
          }
        })
        .catch((error) => {
          console.log(error)
          return new Error('Session retrieval error: ', error)
        })
    } else {
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions')
        .then((data) => {
          console.log('List sessions', data)
          return data
        })
        .catch((error) => {
          return new Error('Session listing error: ', error)
        })
    }
  }

  update(data) {
    let _date
    if (data.date) { _date = stringDateToInt(data.date) }
    return db.result('UPDATE sessions SET status = COALESCE($2, status), user_id = COALESCE($3, user_id), date = COALESCE($4, date), duration_planned = COALESCE($5, duration_planned), duration_success = COALESCE($6, duration_success), location = COALESCE($7, location), note = COALESCE($8, note) WHERE id = $1 RETURNING id, status, user_id, date, duration_planned, duration_success, location, note', [data.id, data.status, data.user_id, _date, data.duration_planned, data.duration_success, data.location, data.note])
      .then((result) => {
        if(result.rowCount === 0) {
          return new Error('Session does not exist')
        } else {
          console.log('Updated session with ID:', result.rows)
          return result.rows[0]
        }
      })
      .catch((error) => {
        console.log(error)
        return new Error('Session update error: ', error)
      })
  }

  delete(id) {
    return db.result('DELETE FROM sessions WHERE id = $1', id)
      .then((result) => {
        if(result.rowCount === 0) {
          return new Error('Session does not exist')
        } else {
          console.log('Deleted session with ID:', id)
          return result
        }
      })
      .catch((error) => {
        console.log(error)
        return new Error('Session deletion error: ', error)
      })
  }
}

export default SessionBase
