import jwt from 'jsonwebtoken';
import config from '../config.server';


const verifyToken = (token) => {
  let isVerified;

  try {
    isVerified = jwt.verify(token, config.auth.jwt.secret);
  } catch (e) {
    isVerified = false;
  }

  return isVerified;
}

export default verifyToken;