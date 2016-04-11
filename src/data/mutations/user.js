import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import userType from '../types/UserType'
import User from '../../model/users'

var UserModel = new User()

var userMutation = {
  addUser: {
    type: userType,
    args: {
      email: {
        type: GraphQLString
      }
    },
    resolve(root, args) {
      return UserModel.add(args)
    }
  },
  deleteUser: {
    type: userType,
    args: {
      userid: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: (root, args) => UserModel.delete(args.userid)
  }

}

export default userMutation
