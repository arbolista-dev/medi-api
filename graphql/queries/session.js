import {
  GraphQLString,
  GraphQLList
} from 'graphql'

import sessionType from '../types/SessionType'
import Session from '../../model/session/session'

var SessionModel = new Session()

const sessionQuery = {
  type: new GraphQLList(sessionType),
  args: {
    id: {
      name: 'id',
      type: GraphQLString
    }
  },
  resolve(root, args) {
    return SessionModel.get(args.id)
  }
}

export default sessionQuery
