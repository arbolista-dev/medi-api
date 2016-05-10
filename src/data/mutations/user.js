import {
  GraphQLString
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
      },
      first_name: {
        type: GraphQLString
      },
      last_name: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve(root, args) {
      return UserModel.add(args)
    }
  },
  updateUser: {
    type: userType,
    args: {
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
      password: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => UserModel.update(args)
  },
  deleteUser: {
    type: userType,
    args: {
      id: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => UserModel.delete(args.id)
  },
  authenticateUser: {
    type: userType,
    args: {
      email: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve(root, args) {
      return UserModel.authenticate(args)
    }
  }
}

export default userMutation
