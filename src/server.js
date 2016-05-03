import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from './data/schema'
import jwt from 'jsonwebtoken'
import ExpressJwt from 'express-jwt'
import passport from 'passport'
import authConfig from './config/auth'

const server = global.server = express()

server.use(passport.initialize())
server.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))


server.listen(3003, () => {
  console.log('The server is running at http://localhost:3003/')
})
