import {
  GraphQLList as List,
  GraphQLID as ID,
  GraphQLString as StringType,
} from 'graphql';
import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import message from '../../tools/message';

const getWebm = {
  type: WebmType,
  args: {
    id: { type: ID },
    hash: { type: StringType },
    excludedIds: { type: new List(ID) },
  },
  resolve(value, { id, hash, excludedIds }) {
    if (id) {
      return Webm.findByPrimary(id).then((webm) => {
        webm.update({
          views: webm.views + 1,
        });

        return webm;
      });
    } else if (hash) {
      return Webm.find({ where: { hash } }).then(webm => webm);
    }

    return Webm.find({
      where: excludedIds.length > 0 ? { id: { $notIn: excludedIds } } : {},
      order: [sequelize.fn('RANDOM')],
    }).then((model) => {
      if (!model) {
        return message;
      }

      model.update({
        views: model.views + 1,
      });

      return model;
    });
  },
};

export default getWebm;
