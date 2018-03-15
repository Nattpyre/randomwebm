import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const UserType = new ObjectType({
  name: 'User',
  fields: {
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    roles: { type: new List(StringType) },
    token: { type: StringType },
  },
});

export default UserType;
