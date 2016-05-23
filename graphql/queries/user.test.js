/* eslint-disable */
const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should(),
    expect = chai.expect()

chai.use(chaiAsPromised)
/* eslint-enable */


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


describe('User queries', () => {
  describe('#get one user by id', () => {
    it('successfully returns valid data', (done) => {
      var query = 'query { user(id:2) { id email first_name last_name } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then((res) => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.user.should.have.deep.property('[0].id', 2)
        res.data.user.should.have.deep.property('[0].email')
        res.data.user.should.have.deep.property('[0].first_name')
        res.data.user.should.have.deep.property('[0].last_name')
        done()
      }).catch(err => console.error(err))
    })

    it('successfully returns valid data including sessions', (done) => {
      var query = 'query { user(id:2) { id email first_name last_name sessions { id status date duration_planned duration_success location note } } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.user.should.have.deep.property('[0].id', 2)
        res.data.user.should.have.deep.property('[0].email')
        res.data.user.should.have.deep.property('[0].first_name')
        res.data.user.should.have.deep.property('[0].last_name')
        res.data.user.should.have.deep.property('[0].sessions[0].id')
        done()
      }).catch(err => console.error(err))
    })

    it('returns error if user does not exist', (done) => {
      var query = 'query { user(id:9999) { id email first_name last_name } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.should.have.property('errors')
        // res.errors[0].should.have.property('message')
        done()
      }).catch(err => console.error(err))
    })
  })

  describe('#get all users', () => {
    it('successfully returns valid data', (done) => {
      var query = 'query { user { id email first_name last_name } }'

      let result = api(query).then(result => {
        return result
      }).catch(err => console.error(err))

      result.then(res => {
        res.should.have.property('data')
        res.should.not.have.property('errors')
        res.data.user.should.have.lengthOf(3)
        res.data.user.should.have.deep.property('[0].id')
        res.data.user.should.have.deep.property('[0].email')
        res.data.user.should.have.deep.property('[0].first_name')
        res.data.user.should.have.deep.property('[0].last_name')
        done()
      }).catch(err => console.error(err))
    })
  })
})
