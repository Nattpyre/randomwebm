import DataType from 'sequelize';
import Model from '../sequelize';

const Webm = Model.define('Webm', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  originalName: {
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  source: {
    type: DataType.TEXT,
  },

  hash: {
    type: DataType.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },

  views: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
    },
  },

  url: {
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true,
    },
  },

  previewUrl: {
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true,
    },
  },

  likes: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
    },
  },

  dislikes: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
    },
  },

  isChecked: {
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notEmpty: true,
    },
  },

}, {

  indexes: [
    { fields: ['hash'] },
  ],

});

export default Webm;
