import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLNonNull} from 'graphql'

import sessionType from '../types/session'
import SessionBase from '../../model/session/session.base'
import Session from '../../model/session/session'

var sessionBase = new SessionBase()

var sessionMutation = {
  addSession: {
    type: sessionType,
    args: {
      status: {
        type: new GraphQLNonNull(GraphQLBoolean)
      },
      user_id: {
        type: GraphQLInt
      },
      date: {
        type: new GraphQLNonNull(GraphQLString)
      },
      duration_planned: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      duration_success: {
        type: GraphQLInt
      },
      location: {
        type: GraphQLString
      },
      note: {
        type: GraphQLString
      }
    },
    resolve(root, args) {
      let session = new Session(args)
      return session.create()
    }
  },
  updateSession: {
    type: sessionType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      status: {
        type: GraphQLBoolean
      },
      user_id: {
        type: GraphQLInt
      },
      date: {
        type: GraphQLString
      },
      duration_planned: {
        type: GraphQLInt
      },
      duration_success: {
        type: GraphQLInt
      },
      location: {
        type: GraphQLString
      },
      note: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => sessionBase.update(args)
  },
  deleteSession: {
    type: sessionType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve: (root, args) => sessionBase.delete(args.id)
  }
}

export default sessionMutation
