import sequelize from '../sequelize';
import Webm from './Webm';

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Webm };
