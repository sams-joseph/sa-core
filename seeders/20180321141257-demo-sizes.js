module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('sizes', [
      {
        displayName: '14 x 48',
        height: 168,
        width: 576,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
      {
        displayName: '10 x 40',
        height: 120,
        width: 480,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('sizes', null, {}),
};
