import {
  GraphQLList as List,
  GraphQLID as ID,
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

const getWebmList = {
  type: new List(WebmType),
  args: {
    tagName: { type: StringType },
    order: { type: OrderType },
    pageSize: { type: IntegerType },
    page: { type: IntegerType },
    likedWebms: { type: new List(ID) },
  },
  resolve(value, { tagName, order, pageSize, page, likedWebms = [] }) {
    if (tagName && likedWebms.length === 0) {
      return Tag.find({ where: { name: tagName } }).then((tag) => {
        if (!tag) {
          return [];
        }

        return tag.getWebms({
          order: order ? [[order, 'DESC']] : null,
          offset: (page - 1) * pageSize,
          limit: pageSize,
        });
      });
    }

    return Webm.findAll({
      where: likedWebms.length > 0 ? { id: { $in: likedWebms } } : {},
      order: order ? [[order, 'DESC']] : null,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }).then(results => results);
  },
};

export default getWebmList;
