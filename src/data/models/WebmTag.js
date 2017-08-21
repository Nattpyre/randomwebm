import DataType from 'sequelize';
import Model from '../sequelize';

const WebmTag = Model.define('WebmTag', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  tag_id: {
    type: DataType.INTEGER,
  },

  webm_id: {
    type: DataType.UUID,
    references: null,
  },
});

export default WebmTag;