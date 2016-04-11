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
    }
  },
})

export default UserType
