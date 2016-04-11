import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql'

import userQuery from './queries/user'
import userMutation from './mutations/user'

// console.log(userMutation)

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: userQuery
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addUser: userMutation.addUser,
      updateUser: userMutation.updateUser,
      deleteUser: userMutation.deleteUser
    }
  })
})

export default schema
