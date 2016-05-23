import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql'

import sessionType from '../types/session'
import SessionBase from '../../model/session/session.base'

var sessionBase = new SessionBase()

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
  resolve(root, args) {
    return sessionBase.get(args)
  }
}

export default sessionQuery
