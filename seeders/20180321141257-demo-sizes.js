module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('sizes', [
      {
        displayName: '10 x 40',
        height: 120,
        width: 480,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
      {
        displayName: '8 x 12',
        height: 96,
        width: 144,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('sizes', null, {}),
};
