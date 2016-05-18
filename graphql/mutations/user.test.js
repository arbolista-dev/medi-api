const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      should = chai.should(),
      expect = chai.expect()

chai.use(chaiAsPromised)

import schema from '../schema'
import { graphql } from 'graphql'

function api(query) {
  var result = graphql(schema, query).then(res => { return res }).catch(err => console.log(err))
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result
}

describe('User mutations', () => {

  describe('add user', (done) => {

    it('is successfully created', (done) => {
      var mutation = 'mutation { addUser ( email: "jimmy1122@example.com", password: "jimmy1", first_name: "Jimmy", last_name: "Hendrix" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('addUser')
        res.should.not.have.property('errors')
        res.data.addUser.email.should.equal('jimmy1122@example.com')
        res.data.addUser.first_name.should.equal('Jimmy')
        res.data.addUser.last_name.should.equal('Hendrix')
        res.data.addUser.token.should.include('.')
        done()
      }).catch(err => console.log(err))
    })

    it('is not created without unique email address', (done) => {
      var mutation = 'mutation { addUser ( email: "jimmy1122@example.com", password: "jimmy1", first_name: "Jimmy", last_name: "Hendrix" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })

    it('is not created without an email address given', (done) => {
      var mutation = 'mutation { addUser ( password: "jimmy1", first_name: "Jimmy", last_name: "Hendrix" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })

    it('is not created without a password given', (done) => {
      var mutation = 'mutation { addUser (  email: "jimmy001@example.com", first_name: "Jimmy", last_name: "Hendrix" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })

  describe('update user', (done) => {

    it('is successfully updated', (done) => {
      var mutation = 'mutation { updateUser (id: 1, email: "sebastianz@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('updateUser')
        res.should.not.have.property('errors')
        res.data.updateUser.email.should.equal('sebastianz@example.com')
        res.data.updateUser.first_name.should.equal('Sebastian')
        res.data.updateUser.last_name.should.equal('Bach')
        res.data.updateUser.token.should.include('.')
        done()
      }).catch(err => console.log(err))
    })

    it('is not updated because email address is not unique', (done) => {
      var mutation = 'mutation { updateUser (id: 105, email: "jimmy@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('updateUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })

    it('is not updated because user with given ID does not exist', (done) => {
      var mutation = 'mutation { updateUser (id: 1010, email: "jimmy@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'


      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('updateUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })

  describe('delete user', (done) => {

    it('is successfully deleted', (done) => {
      var mutation = 'mutation { deleteUser (id: 1) { id } }'

      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        res.data.should.have.property('deleteUser')
        res.should.not.have.property('errors')
        res.data.deleteUser.id.should.be.null
        done()
      }).catch(err => console.log(err))
    })

    it('is not deleted because does not exist', (done) => {
      var mutation = 'mutation { deleteUser (id: 9999) { id } }'


      let result = api(mutation).then(result => {
        return result
        done()
      }).catch(err => console.log(err))

      result.then(res => {
        console.log(res)
        res.data.should.have.property('deleteUser').null
        res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.log(err))
    })
  })
})
