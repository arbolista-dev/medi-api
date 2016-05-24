import chai from 'chai'
chai.should()

import { GraphQLObjectType, GraphQLList } from 'graphql'

import sessionType from './session'


describe('Session type', () => {
  it('exists and is valid', () => {
    sessionType.should.be.an.instanceof(GraphQLObjectType)
    sessionType.name.should.equal('Session')
  })

  it('creates valid list', () => {
    let session_list = new GraphQLList(sessionType)
    session_list.should.exist
    session_list.should.be.an.instanceof(GraphQLList)
  })
})
