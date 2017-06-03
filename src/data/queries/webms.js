import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const getWebms = {
  type: new List(WebmType),
  args: {
    hash: { type: new NonNull(StringType) },
  },
  resolve(value, { hash }) {
    return Webm.findAll({ where: { hash }, raw: true }).then(results => results);
  },
};

export default getWebms;
