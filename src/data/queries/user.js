import {
  GraphQLString as StringType,
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
} from 'graphql'

import UserType from '../types/UserType'
// import { listUsers, getUser, addUser } from '../../model/users'

const userQuery = {
  type: UserType,
  args: {
    id: {
      type: new NonNull(ID)
    }
  },
  resolve(parent, { id }, { rootValue: { ctx: { userModel }} }) {
    return getUser({id})
  }
}

export default userQuery
