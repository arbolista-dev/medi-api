import { GraphQLInt, GraphQLList } from 'graphql'

import userType from '../types/user'
import { getUser } from '../../model/user/user.base'


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
        return getUser(viewer._id)
      } else {
        if (args.id === viewer._id) {
          return getUser(args.id)
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
