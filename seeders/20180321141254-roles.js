module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Demo',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('roles', null, {}),
};
