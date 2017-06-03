import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const getRandomWebm = {
  type: WebmType,
  resolve() {
    return Webm.find({ order: [sequelize.fn('RANDOM')] }).then(results => results);
  },
};

export default getRandomWebm;
