import express from 'express'
import expressGraphQL from 'express-graphql'
import jwt from 'jsonwebtoken'
import ExpressJwt from 'express-jwt'
import passport from 'passport'
import schema from './graphql/schema'
import authConfig from './lib/auth'

const server = global.server = express()

server.use(passport.initialize())

server.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack
  })
}))

server.listen(3003, () => {
  console.log('The server is running at http://localhost:3003/')
})
