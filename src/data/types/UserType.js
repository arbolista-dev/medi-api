import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
      id: {
        type: GraphQLString
      },
      email: {
        type: GraphQLString
      },
      first_name: {
        type: GraphQLString
      },
      last_name: {
        type: GraphQLString
      }
    }
  }
})

export default UserType
