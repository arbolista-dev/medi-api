import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import userType from './UserType'
import User from '../../model/users'

var UserModel = new User()

const SessionType = new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    },
    duration_planned: {
      type: GraphQLString
    },
    duration_success: {
      type: GraphQLString
    },
    note: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    user_id: {
      type: GraphQLString
    },
    user: {
      type: new GraphQLList(userType),
      description: 'The sessions user',
      resolve(root, args) {
        return UserModel.get(root.user_id)
      }
    }
  })
})

export default SessionType
