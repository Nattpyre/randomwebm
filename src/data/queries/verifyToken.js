import {
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import jwt from 'jsonwebtoken';
import config from '../../config.server';

const verifyToken = {
  type: BooleanType,
  args: {
    token: { type: StringType },
  },
  resolve(root, { token }) {
    let isVerified;

    try {
      isVerified = jwt.verify(token, config.auth.jwt.secret);
    } catch (e) {
      isVerified = false;
    }

    return isVerified;
  },
};

export default verifyToken;
