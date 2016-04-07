import { GraphQLString as StringType, GraphQLNonNull as NonNull,
} from 'graphql'

import SessionType from '../types/SessionType'

const sessionQuery = {
  type: Session,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(parent, {id}, {rootValue: {db}}) {
    return db.get(`
      SELECT * FROM sessions WHERE id = $id
      `, {$id: id})
  }
}

export default sessionQuery
