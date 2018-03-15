import sequelize from '../sequelize';
import Webm from './Webm';
import Tag from './Tag';
import WebmTag from './WebmTag';

Webm.belongsToMany(Tag, {
  through: {
    model: WebmTag,
    unique: false,
  },
  foreignKey: 'webm_id',
  constraints: false,
});

Tag.belongsToMany(Webm, {
  through: {
    model: WebmTag,
    unique: false,
  },
  foreignKey: 'tag_id',
  constraints: false,
});

Tag.hasMany(WebmTag, {
  foreignKey: 'tag_id',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
