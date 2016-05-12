import {
  GraphQLInt,
  GraphQLList
} from 'graphql'

import sessionType from '../types/SessionType'
import SessionBase from '../../model/session/session.base'

var sessionBase = new SessionBase()

const sessionQuery = {
  type: new GraphQLList(sessionType),
  args: {
    id: {
      name: 'id',
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return sessionBase.get(args.id)
  }
}

export default sessionQuery
