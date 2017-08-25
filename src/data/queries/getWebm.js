import {
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
  },
  resolve(value, { id, hash }) {
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

    return Webm.find({ order: [sequelize.fn('RANDOM')] }).then((model) => {
      model.update({
        views: model.views + 1,
      });

      return model;
    });
  },
};

export default getWebm;
