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


describe('Session mutations', () => {
  it('-- authenticate User', (done) => {
    let _query = 'mutation { authenticateUser(email: "thomas@example.com", password: "thomas2") { token }}'

    token = getResponse(_query)

    token.then((result) => {
      token = 'Bearer ' + result.res.body.data.authenticateUser.token
      done()
    }).catch(err => console.error(err))
  })

  describe('#add session', () => {
    it('is successfully created', (done) => {
      let mutation = 'mutation { addSession ( user_id: 3, status: true, location: "In the forest", note: "Feeling good", date: "Mon Jun 06 2016 23:05:00 GMT-0500 (CDT)", duration_planned: 600, duration_success: 600 ) { id } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addSession')
        body.should.not.have.property('errors')
        body.data.addSession.id.should.not.be.null
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without having existing user specified', (done) => {
      let mutation = 'mutation { addSession ( user_id: 9999, status: true, location: "In the forest", note: "Feeling good", date: "Mon Jun 06 2016 23:05:00 GMT-0500 (CDT)", duration_planned: 600, duration_success: 600 ) { id } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addSession').null
        body.errors[0].should.have.property('message').and.include('user_id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#update session', () => {
    it('is successful and returns valid data', (done) => {
      let mutation = 'mutation { updateSession ( id: 2, user_id: 2, status: true, location: "At home updated by test", note: "Feeling", date: "Sat Feb 06 2016 22:05:00 GMT-0600 (CST)", duration_planned: 600, duration_success: 600 ) { id user_id note location status duration_planned duration_success } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('updateSession')
        body.should.not.have.property('errors')
        body.data.updateSession.id.should.not.be.null
        done()
      }).catch(err => console.error(err))
    })

    it('is not updated because it does not exist', (done) => {
      let mutation = 'mutation { updateSession ( id: 9999, user_id: 2, status: true, location: "At home", note: "Feeling", date: "Sat Feb 06 2016 22:05:00 GMT-0600 (CST)", duration_planned: 600, duration_success: 600 ) { id } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('updateSession').null
        body.errors[0].should.have.property('message').and.include('id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#delete session', () => {
    it('is successfully deleted', (done) => {
      let mutation = 'mutation { deleteSession (id: 2) { id } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('deleteSession')
        body.should.not.have.property('errors')
        done()
      }).catch(err => console.error(err))
    })

    it('is not deleted because it does not belong to viewer', (done) => {
      let mutation = 'mutation { deleteSession (id: 9999) { id } }'

      let response = getResponseWithAuth(mutation)

      response.then((result) => {
        let body = result.res.body
        body.data.should.have.property('deleteSession').null
        body.errors[0].should.have.property('message').and.include('authorization')
        body.errors[0].should.have.property('message').and.include('not-permitted')
        done()
      }).catch(err => console.error(err))
    })
  })
})
