var pgp = require('pg-promise')()
var connectionString = 'postgres://medi_app:q1w2e3r4t5y6@localhost/medi_app'
var db = pgp(connectionString)

export default db
