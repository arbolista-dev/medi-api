import db from '../../db/config'
import { stringDateToInt } from './session.helper'


class SessionBase {

  get(args) {
    if (args.id) {
      return this.getByID(args.id, args.user_id)
    } else if (args.user_id) {
      return this.getByUser(args.user_id, args.start_date, args.end_date)
    } else {
      return this.getAll(args.start_date, args.end_date)
    }
  }

  getByID(id, user_id) {
    return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE id= $1 AND user_id= $2', [id, user_id])
      .then((data) => {
        if (data[0] == null) {
          return new Error(JSON.stringify({
            arg: 'id',
            code: 'non-existent'
          }))
        } else {
          console.info('Get session', data)
          return data
        }
      })
      .catch(() => {
        return new Error(JSON.stringify({
          code: 'retrieval-error'
        }))
      })
  }

  getByUser(user_id, start, end) {
    if (start && end) {
      let _start = stringDateToInt(start)
      let _end = stringDateToInt(end)
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE user_id= $1 AND date >= $2 AND date <= $3', [user_id, _start, _end])
        .then((data) => {
          if (data[0] == null) {
            return new Error(JSON.stringify({
              arg: 'user_id',
              code: 'non-existent'
            }))
          } else {
            console.info('Get sessions for user', data)
            return data
          }
        })
        .catch(() => {
          return new Error(JSON.stringify({
            code: 'retrieval-error'
          }))
        })
    } else {
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE user_id= $1', user_id)
        .then((data) => {
          console.info('Get sessions for user', data)
          return data
        })
        .catch(() => {
          return new Error(JSON.stringify({
            arg: 'user_id',
            code: 'non-existent'
          }))
        })
    }
  }

  getAll(start, end) {
    if (start && end) {
      let _start = stringDateToInt(start)
      let _end = stringDateToInt(end)
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions WHERE date >= $1 AND date <= $2', [_start, _end])
        .then((data) => {
          console.info('List session within date range', data)
          if (data[0] == null) {
            return new Error(JSON.stringify({
              arg: 'date',
              code: 'non-existent'
            }))
          } else {
            return data
          }
        })
        .catch(() => {
          return new Error(JSON.stringify({
            code: 'retrieval-error'
          }))
        })
    } else {
      return db.any('SELECT id, user_id, status, date::abstime::timestamp, duration_planned, duration_success, location, note FROM sessions')
        .then((data) => {
          console.info('List sessions', data)
          return data
        })
        .catch(() => {
          return new Error(JSON.stringify({
            code: 'retrieval-error'
          }))
        })
    }
  }

  update(data) {
    let _date
    if (data.date) {
      _date = stringDateToInt(data.date)
    }
    if (data.id) {
      return db.result('UPDATE sessions SET status = COALESCE($2, status), user_id = COALESCE($3, user_id), date = COALESCE($4, date), duration_planned = COALESCE($5, duration_planned), duration_success = COALESCE($6, duration_success), location = COALESCE($7, location), note = COALESCE($8, note) WHERE id = $1 RETURNING id, status, user_id, date, duration_planned, duration_success, location, note', [data.id, data.status, data.user_id, _date, data.duration_planned, data.duration_success, data.location, data.note])
        .then((result) => {
          if (result.rowCount === 0) {
            return new Error(JSON.stringify({
              arg: 'id',
              code: 'non-existent'
            }))
          } else {
            console.info('Updated session with ID:', result.rows)
            return result.rows[0]
          }
        })
        .catch(() => {
          return new Error(JSON.stringify({
            code: 'update-error'
          }))
        })
    } else {
      return new Error(JSON.stringify({
        key: 'id',
        code: 'unspecified'
      }))
    }
  }

  delete(id, user_id) {
    if (id) {
      return db.result('DELETE FROM sessions WHERE id = $1 AND user_id = $2', [id, user_id])
        .then((result) => {
          if (result.rowCount === 0) {
            return new Error(JSON.stringify({
              arg: 'id',
              code: 'non-existent'
            }))
          } else {
            console.info('Deleted session with ID:', id)
            return result
          }
        })
        .catch(() => {
          return new Error(JSON.stringify({
            code: 'deletion-error'
          }))
        })
    } else {
      return new Error(JSON.stringify({
        arg: 'id',
        code: 'unspecified'
      }))
    }

  }
}

export default SessionBase
