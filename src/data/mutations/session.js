import {
  GraphQLString
} from 'graphql'

import sessionType from '../types/SessionType'
import Session from '../../model/sessions'

var SessionModel = new Session()

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
      return SessionModel.add(args)
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
    resolve: (root, args) => SessionModel.update(args)
  },
  deleteSession: {
    type: sessionType,
    args: {
      id: {
        type: GraphQLString
      }
    },
    resolve: (root, args) => SessionModel.delete(args.id)
  }

}

export default sessionMutation
