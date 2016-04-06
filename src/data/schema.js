import { GraphQLSchema as Schema, GraphQLObjectType as ObjectType,
} from 'graphql'

import user from './queries/user'
import session from './queries/session'

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      user,
      session,
    },
  }),
})

export default schema
