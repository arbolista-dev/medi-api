import chai from 'chai'
chai.should()

import schema from '../schema'
import { graphql } from 'graphql'


function api(query) {
  var result = graphql(schema, query).then(res => {
    return res
  }).catch(err => console.error(err))
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result
}

describe('User mutations', () => {
  describe('#add user', () => {
    it('is successfully created', (done) => {
      var mutation = 'mutation { addUser ( email: "walter@example.com", password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('addUser')
        res.should.not.have.property('errors')
        res.data.addUser.email.should.equal('walter@example.com')
        res.data.addUser.first_name.should.equal('Walter')
        res.data.addUser.last_name.should.equal('White')
        res.data.addUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without unique email address', (done) => {
      var mutation = 'mutation { addUser ( email: "walter@example.com", password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message').and.include('email')
        res.errors[0].should.have.property('message').and.include('non-unique')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without an email address given', (done) => {
      var mutation = 'mutation { addUser ( password: "walter1", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message').and.include('email')
        res.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is not created without a password given', (done) => {
      var mutation = 'mutation { addUser ( email: "walter1@example.com", first_name: "Walter", last_name: "White" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('addUser').null
        res.errors[0].should.have.property('message').and.include('password')
        res.errors[0].should.have.property('message').and.include('unspecified')

        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#update user', () => {
    it('is successfully updated', (done) => {
      var mutation = 'mutation { updateUser (id: 1, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('updateUser')
        res.should.not.have.property('errors')
        res.data.updateUser.email.should.equal('sebastian@example.com')
        res.data.updateUser.first_name.should.equal('Sebastian')
        res.data.updateUser.last_name.should.equal('Bach')
        res.data.updateUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is not updated because email address is not unique', (done) => {
      var mutation = 'mutation { updateUser (id: 2, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('updateUser').null
        res.errors[0].should.have.property('message').and.include('email')
        res.errors[0].should.have.property('message').and.include('non-unique')
        done()
      }).catch(err => console.error(err))
    })

    it('is not updated because user with given ID does not exist', (done) => {
      var mutation = 'mutation { updateUser (id: 9999, email: "sebastian@example.com", password: "sebastian1", first_name: "Sebastian", last_name: "Bach" ) { id email first_name last_name token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('updateUser').null
        res.errors[0].should.have.property('message').and.include('id')
        res.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#delete user', () => {
    it('is successfully deleted', (done) => {
      var mutation = 'mutation { deleteUser (id: 1) { id } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('deleteUser')
        res.should.not.have.property('errors')
        done()
      }).catch(err => console.error(err))
    })

    it('is not deleted because does not exist', (done) => {
      var mutation = 'mutation { deleteUser (id: 9999) { id } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('deleteUser').null
        res.errors[0].should.have.property('message').and.include('id')
        res.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })

    it('is not deleted because ID is not specified', (done) => {
      var mutation = 'mutation { deleteUser { id } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('deleteUser').null
        res.errors[0].should.have.property('message').and.include('id')
        res.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#authenticate user', () => {
    it('is successful', (done) => {
      var mutation = 'mutation { authenticateUser (email: "walter@example.com", password: "walter1") { token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('authenticateUser')
        res.should.not.have.property('errors')
        res.data.authenticateUser.token.should.include('.')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because user does not exist', (done) => {
      var mutation = 'mutation { authenticateUser (email: "testest@example.com", password: "password") { token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('authenticateUser').null
        res.errors[0].should.have.property('message').and.include('email')
        res.errors[0].should.have.property('message').and.include('non-existent')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because email address is not given', (done) => {
      var mutation = 'mutation { authenticateUser (password: "password") { token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('authenticateUser').null
        res.errors[0].should.have.property('message').and.include('email')
        res.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful because password is not given', (done) => {
      var mutation = 'mutation { authenticateUser (email: "walter@example.com") { token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('authenticateUser').null
        res.errors[0].should.have.property('message').and.include('password')
        res.errors[0].should.have.property('message').and.include('unspecified')
        done()
      }).catch(err => console.error(err))
    })

    it('is unsuccessful with incorrect password', (done) => {
      var mutation = 'mutation { authenticateUser (email: "walter@example.com", password: "password") { token } }'

      let result = api(mutation).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.data.should.have.property('authenticateUser').null
        res.errors[0].should.have.property('message').and.include('password')
        res.errors[0].should.have.property('message').and.include('incorrect')
        done()
      }).catch(err => console.error(err))
    })
  })
})
