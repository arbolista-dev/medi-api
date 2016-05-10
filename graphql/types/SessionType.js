import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

const SessionType = new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    status: {
      type: GraphQLBoolean
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
      type: GraphQLInt
    }
  })
})

export default SessionType
