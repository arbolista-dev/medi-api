import {
  GraphQLInt,
  GraphQLList
} from 'graphql'

import userType from '../types/user'
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
