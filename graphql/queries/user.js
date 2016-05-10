import {
  GraphQLString,
  GraphQLList
} from 'graphql'

import userType from '../types/UserType'
import User from '../../model/user/user'

var UserModel = new User()

const userQuery = {
  type: new GraphQLList(userType),
  args: {
    id: {
      name: 'id',
      type: GraphQLString
    }
  },
  resolve(root, args) {
    return UserModel.get(args.id)
  }
}

export default userQuery
