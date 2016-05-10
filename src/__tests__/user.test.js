const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      should = chai.should(),
      expect = chai.expect()

chai.use(chaiAsPromised)

import schema from '../data/schema.js'
import { graphql } from 'graphql'

function api(query) {
  var result = graphql(schema, query).then(res => { return res }).catch(err => console.log(err))
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result
}

describe('GraphQL user type', () => {

  describe('get users', (done) => {

    var query = 'query { user { id email first_name last_name } }'
    let result = api(query).then(result => {
      console.log(result)
      return result
      done()
    }).catch(err => console.log(err))

    it('returns valid data', (done) => {
      result.then(res => {
        res.should.have.property('data')
        done()
      }).catch(err => console.log(err))
    })

    it('contains valid id', (done) => {
      result.then(res => {
        res.should.have.deep.property('data.user.id', '1')
        // expect(res).to.have.deep.property('data.user.id', '1')
        // expect(res).to.deep.contain({id: 1})
        // expect(res).to.have.any.keys('id', 'email');

        done()
      }).catch(err => console.log(err))
    })
  })
})
