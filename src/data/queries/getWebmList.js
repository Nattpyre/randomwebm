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
  resolve(root, { tagName, order, pageSize, page, likedWebms = [] }) {
    let orderBy = null;

    if (order === 'createdAt') {
      orderBy = [['createdAt', 'DESC']];
    } else if (order !== null) {
      orderBy = [[order, 'DESC'], ['createdAt', 'DESC']];
    }

    if (tagName && likedWebms.length === 0) {
      return Tag.find({ where: { name: tagName } }).then((tag) => {
        if (!tag) {
          return [];
        }

        return tag.getWebms({
          where: { isChecked: true },
          order: orderBy,
          offset: (page - 1) * pageSize,
          limit: pageSize,
        });
      });
    }

    return Webm.findAll({
      where: likedWebms.length > 0 ?
        { id: { $in: likedWebms }, isChecked: true } : { isChecked: true },
      order: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }).then(results => results);
  },
};

export default getWebmList;
