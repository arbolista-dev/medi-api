import { GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql'

import sessionType from '../types/session'
import SessionBase from '../../model/session/session.base'
import Session from '../../model/session/session'


var sessionBase = new SessionBase()

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
        return sessionBase.update(args)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'not-permitted'
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
      let uid = args.user_id ? args.user_id : viewer._id
      if (args.user_id === viewer._id) {
        return sessionBase.delete(args.id)
      } else {
        return new Error(JSON.stringify({
          arg: 'authorization',
          msg: 'not-permitted'
        }))
      }
    }
  }
}

export default sessionMutation
