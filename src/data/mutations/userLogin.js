import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import jwt from 'jsonwebtoken';
import SparkMD5 from 'spark-md5';
import User from '../models/User';
import LoginType from '../types/LoginType';
import config from '../../config.server';

const userLogin = {
  type: LoginType,
  args: {
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },
  resolve: async (root, { email, password }) => {
    const errors = [];

    const user = await User.findOne({ where: { email }, raw: true });

    if (user && user.password === SparkMD5.hash(password)) {
      user.token = jwt.sign({
        id: user.id,
        roles: user.roles,
      }, config.auth.jwt.secret, { expiresIn: config.auth.jwt.expires });
      root.response.cookie('id_token', user.token, { maxAge: 1000 * config.auth.jwt.expires, httpOnly: true });
    } else if (!user) {
      errors.push({ key: 'email', message: 'User not found.' });
    } else {
      errors.push({ key: 'password', message: 'Invalid password.' });
    }

    return {
      user,
      errors,
    };
  },
};

export default userLogin;
