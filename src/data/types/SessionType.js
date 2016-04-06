import { GraphQLObjectType as ObjectType, GraphQLString as StringType, GraphQLNonNull as NonNull,
} from 'graphql'

const SessionType = new ObjectType({
  name: 'Session',
  fields: () => ({
    id: {
      type: new NonNull(ID)
    },
    user: {
      type: User,
      resolve(parent, args, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM User WHERE id = $id;`, { $id: parent.user }
        )
      }
    },
    status: {
      type: StringType
    },
    date: {
      type: StringType
    },
    duration_planned: {
      type: StringType
    },
    duration_success: {
      type: StringType
    },
    note: {
      type: StringType
    },
    location: {
      type: StringType
    },
  })
})

export default SessionType
