import {
  GraphQLString
} from 'graphql'

import sessionType from '../types/SessionType'

import SessionBase from '../../model/session/session.base'
import Session from '../../model/session/session'

var sessionBase = new SessionBase()

var sessionMutation = {
  addSession: {
    type: sessionType,
    args: {
      status: {
        type: GraphQLString
      },
      duration_planned: {
        type: GraphQLString
      },
      note: {
        type: GraphQLString
      },
      user_id: {
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
        type: GraphQLString
      },
      status: {
        type: GraphQLString
      },
      duration_success: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => sessionBase.update(args)
  },
  deleteSession: {
    type: sessionType,
    args: {
      id: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => sessionBase.delete(args.id)
  }

}

export default sessionMutation
