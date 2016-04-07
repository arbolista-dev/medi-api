import {
  GraphQLString as StringType,
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
} from 'graphql'

import UserType from '../types/UserType'
import User from '../../model/users'

var userModel = new User

const userQuery = {
  type: UserType,
  args: {
    id: {
      type: new NonNull(ID)
    }
  },
  resolve(parent, { id }, { userModel }) {
    return userModel.get({id})
  }
}

export default userQuery
