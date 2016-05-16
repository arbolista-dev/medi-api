import {
  GraphQLInt,
  GraphQLList,
  GraphQLString
} from 'graphql'

import userType from '../types/UserType'
import UserBase from '../../model/user/user.base'

var userBase = new UserBase()

const userQuery = {
  type: new GraphQLList(userType),
  args: {
    id: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return userBase.get(args.id)
  }
}

export default userQuery
