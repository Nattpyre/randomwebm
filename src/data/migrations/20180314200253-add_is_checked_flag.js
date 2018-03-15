import DataType from 'sequelize';

export default {
  up: queryInterface =>
    queryInterface.addColumn('Webm', 'isChecked', {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notEmpty: true,
      },
    }),

  down: queryInterface => queryInterface.removeColumn('Webm', 'isChecked'),
};
