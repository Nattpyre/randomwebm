import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import Tag from '../models/Tag';

const getWebms = {
  type: new List(WebmType),
  args: {
    hash: { type: StringType },
    tagId: { type: IntegerType },
  },
  resolve(value, { hash, tagId }) {
    if (hash) {
      return Webm.findAll({ where: { hash }, raw: true }).then(results => results);
    } else if (tagId) {
      return Tag.findByPrimary(tagId).then(tag => tag.getWebms());
    }

    return Webm.findAll().then(results => results);
  },
};

export default getWebms;
