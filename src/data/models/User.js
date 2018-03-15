import DataType from 'sequelize';
import Model from '../sequelize';
import config from '../../config.server';

const User = Model.define('User', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    unique: true,
    validate: { isEmail: true },
  },

  password: {
    type: DataType.STRING(64),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  roles: {
    type: DataType.ARRAY(DataType.ENUM(config.userRoles)),
    validate: {
      notEmpty: true,
    },
  },

}, {

  timestamps: false,

  indexes: [
    { fields: ['email'] },
  ],

});

export default User;
