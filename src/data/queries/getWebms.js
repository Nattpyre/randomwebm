import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLEnumType as EnumType,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import Tag from '../models/Tag';

const OrderType = new EnumType({
  name: 'Order',
  values: {
    createdAt: { description: 'Order by upload date' },
    likes: { description: 'Order by number of likes' },
    views: { description: 'Order by number of views' },
  },
});

const getWebms = {
  type: new List(WebmType),
  args: {
    hash: { type: StringType },
    tagName: { type: StringType },
    order: { type: OrderType },
    pageSize: { type: IntegerType },
    page: { type: IntegerType },
  },
  resolve(value, { hash, tagName, order, pageSize, page }) {
    if (hash) {
      return Webm.findAll({ where: { hash }, raw: true }).then(results => results);
    } else if (tagName) {
      return Tag.find({ where: { name: tagName } }).then(tag => tag.getWebms({
        order: order ? [[order, 'DESC']] : null,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }));
    }

    return Webm.findAll({
      order: order ? [[order, 'DESC']] : null,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }).then(results => results);
  },
};

export default getWebms;
