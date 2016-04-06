import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql'

import UserType from '../types/UserType'
import User from '../../model/users'

const user = {
  type: User,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(parent, {id}) {
    user = User()
    return user.get({id})
  }
}

export default user
