export default {
  up: queryInterface => queryInterface.dropTable('User'),
  down: () => null,
};
