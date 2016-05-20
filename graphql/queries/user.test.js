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


describe('User queries', () => {

  describe('get users', (done) => {

    var query = 'query { user(id:1) { id email first_name last_name } }'
    let result = api(query).then(result => {
      console.log('user query result', result)
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
        // console.log('contains valid id RESULT', res.data.user[0].id)
        res.data.user[0].id.should.equal(1)
        // res.should.have.deep.property('data.user.id', '1')
        // console.log(data.user)
        // expect(res).to.have.deep.property('data.user.id', '1')
        // expect(res).to.deep.contain({id: 1})
        // expect(res).to.have.any.keys('id', 'email');

        done()
      }).catch(err => console.log(err))
    })
  })
})
