import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'

import sessionType from '../types/session'
import { getSessionByUser } from '../../model/session/session.base'


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    email: {
      type: GraphQLString
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    sessions: {
      type: new GraphQLList(sessionType),
      resolve(root) {
        return getSessionByUser(root.id)
      }
    },
    token: {
      type: GraphQLString
    }
  })
})

export default UserType
