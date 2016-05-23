import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import userQueries from './queries/user'
import userMutations from './mutations/user'

import sessionQueries from './queries/session'
import sessionMutations from './mutations/session'


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: userQueries,
      session: sessionQueries
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addUser: userMutations.addUser,
      updateUser: userMutations.updateUser,
      deleteUser: userMutations.deleteUser,
      authenticateUser: userMutations.authenticateUser,
      addSession: sessionMutations.addSession,
      updateSession: sessionMutations.updateSession,
      deleteSession: sessionMutations.deleteSession
    }
  })
})

export default schema
