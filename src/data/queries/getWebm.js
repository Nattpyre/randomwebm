import {
  GraphQLList as List,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
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
    isChecked: { type: BooleanType },
    excludedIds: { type: new List(ID) },
  },
  resolve(value, { id, hash, isChecked = true, excludedIds = [] }) {
    if (id) {
      const params = isChecked ? { id } : { id, isChecked: false };

      return Webm.findOne({ where: params }).then((webm) => {
        if (!webm) {
          return null;
        }

        webm.update({
          views: webm.views + 1,
        });

        return webm;
      });
    } else if (hash) {
      return Webm.find({ where: { hash, isChecked: true } }).then(webm => webm);
    } else if (!isChecked) {
      return Webm.find({ where: { isChecked: false } }).then(webm => webm);
    }

    return Webm.find({
      where: excludedIds.length > 0 ?
        { id: { $notIn: excludedIds }, isChecked: true } : { isChecked: true },
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
