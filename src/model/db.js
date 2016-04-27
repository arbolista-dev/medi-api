var config = require('../config/constants')

var pgp = require('pg-promise')()
var connectionString = config.dev.database
var db = pgp(connectionString)

export default db
