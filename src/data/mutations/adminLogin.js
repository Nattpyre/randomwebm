import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import jwt from 'jsonwebtoken';
import SparkMD5 from 'spark-md5';
import LoginType from '../types/LoginType';
import config from '../../config.server';

const adminLogin = {
  type: LoginType,
  args: {
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  resolve: async (root, { email, password }) => {
    const errors = [];
    let token;

    if (config.auth.email === email && config.auth.password === SparkMD5.hash(password)) {
      token = jwt.sign({}, config.auth.jwt.secret, { expiresIn: config.auth.jwt.expires });
    } else if (config.auth.email !== email) {
      errors.push({ key: 'email', message: 'Invalid email.' });
    } else {
      errors.push({ key: 'password', message: 'Invalid password.' });
    }

    return {
      token,
      errors,
    };
  },
};

export default adminLogin;
