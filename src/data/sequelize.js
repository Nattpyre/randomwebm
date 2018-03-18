import Sequelize from 'sequelize';
import config from '../config/server';

const sequelize = new Sequelize(config.databaseUrl, {
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
