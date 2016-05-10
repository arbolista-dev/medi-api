require('dotenv').load()

var pgp = require('pg-promise')()
var db = pgp(process.env.DATABASE_URL)

export default db
