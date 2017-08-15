import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const getRandomWebm = {
  type: WebmType,
  resolve() {
    return Webm.find({ order: [sequelize.fn('RANDOM')] }).then((model) => {
      model.update({
        views: model.views + 1,
      });

      return model;
    });
  },
};

export default getRandomWebm;
