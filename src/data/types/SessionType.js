import { GraphQLObjectType, GraphQLString, GraphQLNonNull
} from 'graphql'

const SessionType = new GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(ID)
    },
    user: {
      type: User,
      resolve(parent, { user_id }, { sessionModel }}) {
        return sessionModel.get({ user_id })
      }
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
  })
})

export default SessionType
