import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql'

import sessionType from '../types/session'
import { getSession } from '../../model/session/session.base'


const sessionQuery = {
  type: new GraphQLList(sessionType),
  args: {
    id: {
      type: GraphQLInt
    },
    user_id: {
      type: GraphQLInt
    },
    start_date: {
      type: GraphQLString
    },
    end_date: {
      type: GraphQLString
    }
  },
  resolve(root, args, { rootValue: { viewer }}) {
    console.info('Root viewer: ', viewer)
    if (viewer) {
      // getting list of all sessions currently not possible
      let uid = args.user_id ? args.user_id : viewer._id
      let params = {
        id: args.id,
        user_id: uid,
        start_date: args.start_date,
        end_date: args.end_date
      }
      return getSession(params)
    } else {
      return new Error(JSON.stringify({
        arg: 'authorization',
        msg: 'not-permitted'
      }))
    }
  }
}

export default sessionQuery
