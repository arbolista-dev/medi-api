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
      type: GraphQLInt
    },
    duration_success: {
      type: GraphQLInt
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
