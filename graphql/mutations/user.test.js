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

describe('User mutations', () => {
  describe('#add user', () => {
    it('is successfully created', (done) => {
      let mutation = 'mutation { addUser ( email: "walter@example.com", password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addUser')
        body.should.not.have.property('errors')
        body.data.addUser.email.should.equal('walter@example.com')
        body.data.addUser.first_name.should.equal('Walter')
        body.data.addUser.last_name.should.equal('White')
        body.data.addUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without unique email address', (done) => {
      let mutation = 'mutation { addUser ( email: "walter@example.com", password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addUser').null
        body.errors[0].should.have.property('message').and.include('email')
        body.errors[0].should.have.property('message').and.include('non-unique')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without an email address given', (done) => {
      let mutation = 'mutation { addUser ( password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addUser').null
        body.errors[0].should.have.property('message').and.include('email')
        body.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without a password given', (done) => {
      let mutation = 'mutation { addUser ( email: "walter1@example.com", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('addUser').null
        body.errors[0].should.have.property('message').and.include('password')
        body.errors[0].should.have.property('message').and.include('unspecified')

        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#authenticate user', () => {
    it('is successful', (done) => {
      let mutation = 'mutation { authenticateUser (email: "walter@example.com", password: "walter1") { token } }'

      token = getResponse(mutation)

      token.then(result => {
        let body = result.res.body
        token = 'Bearer ' + body.data.authenticateUser.token
        body.data.should.have.property('authenticateUser')
        body.should.not.have.property('errors')
        body.data.authenticateUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because user does not exist', (done) => {
      let mutation = 'mutation { authenticateUser (email: "testest@example.com", password: "password") { token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('authenticateUser').null
        body.errors[0].should.have.property('message').and.include('email')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because email address is not given', (done) => {
      let mutation = 'mutation { authenticateUser (password: "password") { token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('authenticateUser').null
        body.errors[0].should.have.property('message').and.include('email')
        body.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because password is not given', (done) => {
      let mutation = 'mutation { authenticateUser (email: "walter@example.com") { token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('authenticateUser').null
        body.errors[0].should.have.property('message').and.include('password')
        body.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful with incorrect password', (done) => {
      let mutation = 'mutation { authenticateUser (email: "walter@example.com", password: "password") { token } }'

      let response = getResponse(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('authenticateUser').null
        body.errors[0].should.have.property('message').and.include('password')
        body.errors[0].should.have.property('message').and.include('incorrect')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#update user', () => {
    it('is successfully updated', (done) => {
      let mutation = 'mutation { updateUser (id: 1, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('updateUser')
        body.should.not.have.property('errors')
        body.data.updateUser.email.should.equal('sebastian@example.com')
        body.data.updateUser.first_name.should.equal('Sebastian')
        body.data.updateUser.last_name.should.equal('Bach')
        body.data.updateUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is not updated because email address is not unique', (done) => {
      let mutation = 'mutation { updateUser (id: 2, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('updateUser').null
        body.errors[0].should.have.property('message').and.include('email')
        body.errors[0].should.have.property('message').and.include('non-unique')
        done()
      }).catch(err => console.error(err))
    })

    it('is not updated because user with given ID does not exist', (done) => {
      let mutation = 'mutation { updateUser (id: 9999, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('updateUser').null
        body.errors[0].should.have.property('message').and.include('id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#delete user', () => {
    it('is successfully deleted', (done) => {
      let mutation = 'mutation { deleteUser (id: 1) { id } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('deleteUser')
        body.should.not.have.property('errors')
        done()
      }).catch(err => console.error(err))
    })

    it('is not deleted because does not exist', (done) => {
      let mutation = 'mutation { deleteUser (id: 9999) { id } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('deleteUser').null
        body.errors[0].should.have.property('message').and.include('id')
        body.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })

    it('is not deleted because ID is not specified', (done) => {
      let mutation = 'mutation { deleteUser { id } }'

      let response = getResponseWithAuth(mutation)

      response.then(result => {
        let body = result.res.body
        body.data.should.have.property('deleteUser').null
        body.errors[0].should.have.property('message').and.include('id')
        body.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })
  })
})
