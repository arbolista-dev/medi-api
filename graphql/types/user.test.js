import { GraphQLSchema, GraphQLObjectType, GraphQLList } from 'graphql'
import userType from './user'

import chai from 'chai'
chai.should()


describe('User type', () => {
  it('exists and is valid', () => {
    userType.should.be.an.instanceof(GraphQLObjectType)
    userType.name.should.equal('User')
  })

  it('creates valid list', () => {
    let user_list = new GraphQLList(userType)
    user_list.should.exist
    user_list.should.be.an.instanceof(GraphQLList)
  })
})
