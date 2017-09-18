import {
  GraphQLList as List,
  GraphQLID as ID,
  GraphQLInt as IntegerType,
} from 'graphql';
import sequelize from '../sequelize';
import TagType from '../types/TagType';
import Webm from '../models/Webm';
import Tag from '../models/Tag';
import WebmTag from '../models/WebmTag';

const getTags = {
  type: new List(TagType),
  args: {
    webmId: { type: ID },
    limit: { type: IntegerType },
  },
  resolve(value, { webmId, limit }) {
    if (webmId) {
      return Webm.findByPrimary(webmId, { limit }).then((webm) => {
        if (!webm) {
          return [];
        }

        return webm.getTags();
      });
    }

    return Tag.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: WebmTag,
        attributes: [],
        required: false,
      }],
      subQuery: false,
      group: [sequelize.col('Tag.id')],
      order: [[sequelize.fn('COUNT', 'id'), 'DESC']],
      limit,
    });
  },
};

export default getTags;
