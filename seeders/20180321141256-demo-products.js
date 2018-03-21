module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('products', [
      {
        name: 'Bulletin',
        description: 'Description',
        imageUrl: 'http://via.placeholder.com/350x150',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('products', null, {}),
};
