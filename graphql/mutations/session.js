import { GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql'

import sessionType from '../types/session'
import { updateSession, deleteSession } from '../../model/session/session.base'
import Session from '../../model/session/session'


var sessionMutation = {
  addSession: {
    type: sessionType,
    args: {
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
    resolve(root, args) {
      let session = new Session(args)
      return session.create()
    }
  },
  updateSession: {
    type: sessionType,
    args: {
      id: {
        type: GraphQLInt
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
    resolve(root, args, { rootValue: { viewer }}) {
      console.info('Root viewer: ', viewer)
      if (args.user_id === viewer._id) {
        return updateSession(args)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'failed'
        }))
      }
    }
  },
  deleteSession: {
    type: sessionType,
    args: {
      id: {
        type: GraphQLInt
      }
    },
    resolve(root, args, { rootValue: { viewer }}) {
      console.info('Root viewer: ', viewer)
      if (viewer._id) {
        return deleteSession(args.id, viewer._id)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'failed'
        }))
      }
    }
  }
}

export default sessionMutation
