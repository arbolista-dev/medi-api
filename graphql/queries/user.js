import { GraphQLInt, GraphQLList } from 'graphql'

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
  resolve(root, args, { rootValue: { viewer }}) {
    console.info('Root viewer: ', viewer)
    if (viewer) {
      if (!args.id) {
        return userBase.get(viewer._id)
      } else {
        if (args.id === viewer._id) {
          return userBase.get(args.id)
        } else {
          return new Error(JSON.stringify({
            arg: 'authorization',
            msg: 'not-permitted'
          }))
        }
      }
    } else {
      return new Error(JSON.stringify({
        arg: 'authorization',
        msg: 'not-permitted'
      }))
    }
  }
}

export default userQuery
