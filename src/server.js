import express from 'express'
import expressGraphQL from 'express-graphql'

const server = global.server = express()

server.use('/graphql', expressGraphQL({
  schema: MyGraphQLSchema,
  graphiql: true
}))

server.listen(3003, () => {
  console.log(`The server is running at http://localhost:3003/`)
})
