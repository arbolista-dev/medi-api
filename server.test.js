import chai from 'chai'
chai.should()

import schema from './graphql/schema'
import { graphql } from 'graphql'


function api(query) {
  var result = graphql(schema, query).then(res => { return res })
  if (result.errors !== undefined) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result;
}

describe('GraphQL', () => {

  it('should respond to empty requests with errors', (done) => {
    var query = '{ }'
    api(query).then(result => {
      result.should.have.property('errors')
      done()
    })
  })
})
