import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import userType from '../types/UserType'
import User from '../../model/users'

var userModel = new User()

const userQuery = {
  type: new GraphQLList(userType),
  args: {
    id: {
      name: 'id',
      type: GraphQLString
    }
  },
  resolve(root, args) {
    return userModel.get(args.id)
  }
}

export default userQuery
