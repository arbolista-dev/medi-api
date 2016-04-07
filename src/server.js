import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from './data/schema'

const server = global.server = express()

/* PG Test */
import User from './model/users'
var user = new User()
console.log('user list', user.list())


server.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))


server.listen(3003, () => {
  console.log(`The server is running at http://localhost:3003/`)
})
