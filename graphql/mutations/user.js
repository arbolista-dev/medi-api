import { GraphQLString, GraphQLInt } from 'graphql'

import userType from '../types/user'

import {
  updateUser,
  deleteUser,
  authenticateUser
} from '../../model/user/user.base'
import User from '../../model/user/user'

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
    resolve(root, args, { rootValue: { viewer }}) {
      console.info('Root viewer: ', viewer)
      if (args.id === viewer._id) {
        return updateUser(args)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'failed'
        }))
      }
    }
  },
  deleteUser: {
    type: userType,
    args: {
      id: {
        type: GraphQLInt
      }
    },
    resolve(root, args, { rootValue: { viewer }}) {
      console.info('Root viewer: ', viewer)
      if (args.id === viewer._id) {
        return deleteUser(args.id)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'failed'
        }))
      }
    }
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
      return authenticateUser(args)
    }
  }
}

export default userMutation
