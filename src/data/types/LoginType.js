import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import UserType from './UserType';
import ErrorType from './ErrorType';

const LoginType = new ObjectType({
  name: 'Login',
  fields: {
    user: { type: UserType },
    errors: { type: ErrorType },
  },
});

export default LoginType;