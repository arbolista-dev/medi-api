import chai from 'chai'
chai.should()
import request from 'supertest-as-promised'
import { stringify } from 'querystring'

require('dotenv').load()
import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from '../schema'
import jwt from 'express-jwt'

const server = express()
var token

server.use(jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false}))

server.use('/graphql', expressGraphQL((request) => ({
  schema: schema,
  rootValue: { viewer: request.user || '' },
  graphiql: true
})))

function urlString(urlParams) {
  let string = '/graphql'
  if (urlParams) {
    string += ('?' + stringify(urlParams))
  }
  return string
}

function getResponseWithAuth(_query) {
  return request(server).post(urlString()).set('authorization', token).send({ query: _query }).then((result) => { return result })
}

function getResponse(_query) {
  return request(server).post(urlString()).send({ query: _query }).then((result) => { return result })
}

describe('User queries', () => {
  it('-- authenticate User', (done) => {
    let _query = 'mutation { authenticateUser(email: "thomas@example.com", password: "thomas2") { token }}'

    token = getResponse(_query)

    token.then((result) => {
      token = 'Bearer ' + result.res.body.data.authenticateUser.token
      done()
    }).catch(err => console.error(err))
  })

  describe('#get one user by id', () => {
    it('successfully returns valid data', (done) => {
      let query = 'query { user(id:2) { id email first_name last_name } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        body.should.have.property('data')
        body.should.not.have.property('errors')
        body.data.user.should.have.deep.property('[0].id', 2)
        body.data.user.should.have.deep.property('[0].email')
        body.data.user.should.have.deep.property('[0].first_name')
        body.data.user.should.have.deep.property('[0].last_name')
        done()
      }).catch(err => console.error(err))
    })

    it('successfully returns valid data including sessions', (done) => {
      let query = 'query { user(id:2) { id email first_name last_name sessions { id status date duration_planned duration_success location note } } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        body.should.have.property('data')
        body.should.not.have.property('errors')
        body.data.user.should.have.deep.property('[0].id', 2)
        body.data.user.should.have.deep.property('[0].email')
        body.data.user.should.have.deep.property('[0].first_name')
        body.data.user.should.have.deep.property('[0].last_name')
        body.data.user.should.have.deep.property('[0].sessions[0].id')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if trying to access user other then himself', (done) => {
      let query = 'query { user(id:9999) { id email first_name last_name } }'

      let response = getResponseWithAuth(query)

      response.then(result => {
        let body = result.res.body
        body.should.have.property('data')
        body.errors[0].should.have.property('message').and.include('authorization')
        body.errors[0].should.have.property('message').and.include('not-permitted')
        done()
      }).catch(err => console.error(err))
    })
  })

  // describe('#get all users', () => {
  //   it('successfully returns valid data', (done) => {
  //     let query = 'query { user { id email first_name last_name } }'
  //
  //     let response = getResponseWithAuth(query)
  //
  //     response.then(result => {
  //       let body = result.res.body
  //       body.should.have.property('data')
  //       body.should.not.have.property('errors')
  //       body.data.user.should.have.lengthOf(3)
  //       body.data.user.should.have.deep.property('[0].id')
  //       body.data.user.should.have.deep.property('[0].email')
  //       body.data.user.should.have.deep.property('[0].first_name')
  //       body.data.user.should.have.deep.property('[0].last_name')
  //       done()
  //     }).catch(err => console.error(err))
  //   })
  // })
})
