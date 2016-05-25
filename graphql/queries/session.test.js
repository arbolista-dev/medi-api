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

describe('Session queries', () => {
  it('-- authenticate User', (done) => {
    let _query = 'mutation { authenticateUser(email: "thomas@example.com", password: "thomas2") { token }}'

    token = request(server).post(urlString())
    .send({ query: _query })
    .then((result) => {
      return result
    })

    token.then((result) => {
      token = 'Bearer ' + result.res.body.data.authenticateUser.token
      done()
    }).catch(err => console.error(err))
  })

  describe('#get one session by id', () => {
    it('successfully returns valid data', (done) => {
      let query = 'query { session(id:2) { id user_id status date duration_planned duration_success  location note } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        body.should.have.property('data')
        body.should.not.have.property('errors')
        body.data.session.should.have.deep.property('[0].id', 2)
        body.data.session.should.have.deep.property('[0].user_id')
        body.data.session.should.have.deep.property('[0].status')
        body.data.session.should.have.deep.property('[0].date')
        body.data.session.should.have.deep.property('[0].duration_planned')
        body.data.session.should.have.deep.property('[0].duration_success')
        body.data.session.should.have.deep.property('[0].location')
        body.data.session.should.have.deep.property('[0].note')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if session does not exist', (done) => {
      let query = 'query { session(id:9999) { id user_id status date duration_planned duration_success  location note } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        body.should.have.property('data')
        body.errors[0].should.have.property('message').and.include('id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#get sessions by user and date range', () => {
    it('successfully returns valid data', (done) => {
      let query = 'query { session(user_id: 2, start_date: "2016-05-01", end_date: "2016-05-31") { id user_id status date duration_planned duration_success  location note } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        body.should.have.property('data')
        body.should.not.have.property('errors')
        body.data.session.should.have.deep.property('[0].id')
        body.data.session.should.have.deep.property('[0].user_id', 2)
        body.data.session.should.have.deep.property('[0].status')
        body.data.session.should.have.deep.property('[0].date')
        body.data.session.should.have.deep.property('[0].duration_planned')
        body.data.session.should.have.deep.property('[0].duration_success')
        body.data.session.should.have.deep.property('[0].location')
        body.data.session.should.have.deep.property('[0].note')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if no sessions exist for user within date range', (done) => {
      let query = 'query { session(user_id: 999, start_date: "2016-04-22", end_date: "2016-05-25") { id user_id status date duration_planned duration_success  location note } }'

      let response = getResponseWithAuth(query)

      response.then((result) => {
        let body = result.res.body
        console.log('err body', body)
        body.should.have.property('data')
        body.errors[0].should.have.property('message').and.include('user_id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  // describe('#get all sessions', () => {
  //   it('successfully returns valid data', (done) => {
  //     let query = 'query { session { id user_id status date duration_planned duration_success  location note } }'
  //
  //     let response = getResponseWithAuth(query)
  //
  //     response.then((result) => {
  //       let body = result.res.body
  //       body.should.have.property('data')
  //       body.should.not.have.property('errors')
  //       body.data.session.should.have.lengthOf(3)
  //       body.data.session.should.have.deep.property('[0].id')
  //       body.data.session.should.have.deep.property('[0].user_id')
  //       body.data.session.should.have.deep.property('[0].status')
  //       body.data.session.should.have.deep.property('[0].date')
  //       body.data.session.should.have.deep.property('[0].duration_planned')
  //       body.data.session.should.have.deep.property('[0].duration_success')
  //       body.data.session.should.have.deep.property('[0].location')
  //       body.data.session.should.have.deep.property('[0].note')
  //       done()
  //     }).catch(err => console.error(err))
  //   })
  // })
})
