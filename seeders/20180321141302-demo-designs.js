module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('designs', [
      {
        name: 'Victim',
        description: 'Description',
        imageUrl: 'http://via.placeholder.com/350x150',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('designs', null, {}),
};
