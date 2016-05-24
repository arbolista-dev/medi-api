import { GraphQLString, GraphQLInt } from 'graphql'

import userType from '../types/user'

import UserBase from '../../model/user/user.base'
import User from '../../model/user/user'


var userBase = new UserBase()

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
      let user = new User(args)
      return user.create()
    }
  },
  updateUser: {
    type: userType,
    args: {
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
      password: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => userBase.update(args)
  },
  deleteUser: {
    type: userType,
    args: {
      id: {
        type: GraphQLInt
      }
    },
    resolve: (root, args) => userBase.delete(args.id)
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
      return userBase.authenticate(args)
    }
  }
}

export default userMutation
