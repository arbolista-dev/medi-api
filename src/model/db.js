var config = require('../config/constants')

var pgp = require('pg-promise')()
var connectionString = config.dev.database
console.log('connstring', connectionString)
var db = pgp(connectionString)

export default db
