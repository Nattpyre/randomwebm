import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import ErrorType from './ErrorType';

const LoginType = new ObjectType({
  name: 'Login',
  fields: {
    token: { type: StringType },
    errors: { type: ErrorType },
  },
});

export default LoginType;