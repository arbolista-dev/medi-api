import db from 'pg'

cont databaseUrl = 'postgres://medi_app:q1w2e3r4t5y6@localhost/medi_app'

db.defaults.ssl = true
db.defaults.poolSize = 10

function AsyncClient(client) {
  this.client = client
  this.query = this.query.bind(this)
  this.end = this.end.bind(this)
}

AsyncClient.prototype.query = function query(sql, ...args) {
  return new Promise((resolve, reject) => {
    if (args.length) {
      this.client.query(sql, args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    } else {
      this.client.query(sql, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    }
  })
}

AsyncClient.prototype.end = function end() {
  this.client.end()
}

db.connect = (connect => callback => new Promise((resolve, reject) => {
  connect.call(db, databaseUrl, (err, client, done) => {
    if (err) {
      if (client) {
        done(client)
      }
      reject(err)
    } else {
      callback(new AsyncClient(client)).then(() => {
        done()
        resolve()
      }).catch(error => {
        done(client)
        reject(error)
      })
    }
  })
}))(db.connect)

export default db
