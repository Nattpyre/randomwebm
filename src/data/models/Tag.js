import DataType from 'sequelize';
import Model from '../sequelize';

const Tag = Model.define('Tag', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

export default Tag;