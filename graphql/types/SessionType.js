import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const SessionType = new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    },
    duration_planned: {
      type: GraphQLString
    },
    duration_success: {
      type: GraphQLString
    },
    note: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    user_id: {
      type: GraphQLString
    }
  })
})

export default SessionType
