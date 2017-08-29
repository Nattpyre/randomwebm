import {
  GraphQLList as List,
  GraphQLID as ID,
  GraphQLString as StringType,
} from 'graphql';
import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const getWebm = {
  type: WebmType,
  args: {
    id: { type: ID },
    hash: { type: StringType },
    lastViewed: { type: new List(ID) },
  },
  resolve(value, { id, hash, lastViewed }) {
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
      where: lastViewed.length > 0 ? { id: { $notIn: lastViewed } } : {},
      order: [sequelize.fn('RANDOM')],
    }).then((model) => {
      model.update({
        views: model.views + 1,
      });

      return model;
    });
  },
};

export default getWebm;
