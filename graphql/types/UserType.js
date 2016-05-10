import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql'

import sessionType from '../types/SessionType'
import Session from '../../model/session/session'

var SessionModel = new Session()

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLString
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
      resolve(root, args) {
        return SessionModel.getByUser(root.id)
      }
    },
    token: {
      type: GraphQLString
    }
  })
})

export default UserType
