import express from 'express'
import expressGraphQL from 'express-graphql'
import jwt from 'jsonwebtoken'
import ExpressJwt from 'express-jwt'
import passport from 'passport'
import schema from './graphql/schema'
import authConfig from './lib/auth'
import yaml from 'js-yaml'
import fs from 'fs'

const server = global.server = express()

/* API DOCS */
server.set('view engine', 'ejs')
server.set('views', 'docs')

// server.get('/docs', (req, res) => {
//
//   var data = {}
//
//   try {
//     data.user = yaml.safeLoad(fs.readFileSync('docs/user.yml', 'utf8'));
//     data.session = yaml.safeLoad(fs.readFileSync('docs/session.yml', 'utf8'));
//     console.log(data);
//   } catch (e) {
//     console.log(e);
//   }
//
//   res.render('template', {routes: data})
// })
server.get('/docs', (req, res) => {
  res.render('partials/list', {route_list: ['user', 'session']})
})

server.get('/docs/:model', (req, res) => {
  let model = req.params.model
  var data = {}
  try {
    data = yaml.safeLoad(fs.readFileSync('docs/' + model + '.yml', 'utf8'));
    console.log(data);
  } catch (e) {
    console.log(e);
  }

  res.render('partials/detail', {
    model: data
  })
})

/* API */
server.use(passport.initialize())

server.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

server.listen(3003, () => {
    console.log('The server is running at http://localhost:3003/')
})
