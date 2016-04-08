import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import UserType from '../types/UserType'
import User from '../../model/users'

var userModel = new User()

const userQuery = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLString
    }
  },
  resolve(root, args) {
    return userModel.get(args.id)
    // not possible because type needs to be defined as List(UserType)
    // if (args.id) {
    //   return userModel.find(args.id)
    // } else {
    //   return userModel.list()
    // }

  }
}

export default userQuery
