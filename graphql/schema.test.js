import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import schema from './schema'

import chai from 'chai'
chai.should()

describe('GraphQL schema', () => {
  it('creates a valid schema', () => {
    schema.should.be.an.instanceof(GraphQLSchema)
  })

  it('contains queries', () => {
    schema._queryType.should.exist
  })

  it('contains mutations', () => {
    schema._mutationType.should.exist
  })
})
