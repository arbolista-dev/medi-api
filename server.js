import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from './graphql/schema'
import yaml from 'js-yaml'
import fs from 'fs'
import jwt from 'express-jwt'
require('dotenv').load()

const server = global.server = express()

/* API DOCS */
server.set('view engine', 'ejs')
server.set('views', 'docs')

server.get('/docs', (req, res) => {
  res.render('partials/list', {route_list: ['user', 'session']})
})

server.get('/docs/:model', (req, res) => {
  let model = req.params.model
  var data = {}
  try {
    data = yaml.safeLoad(fs.readFileSync('docs/' + model + '.yml', 'utf8'));
  } catch (e) {
    console.error(e);
  }

  res.render('partials/detail', {
    model: data
  })
})

/* API */
server.use(jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false}))

server.use('/graphql', expressGraphQL((request) => ({
  schema: schema,
  rootValue: { viewer: request.user || '' },
  graphiql: true
})))

server.listen(3003, () => {
  console.info('The server is running at http://localhost:3003/')
})
