module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('parts', [
      {
        quantity: 1,
        name: 'Name',
        date: 'Date',
        image: 'http://via.placeholder.com/350x150',
        portrait: 'http://via.placeholder.com/350x150',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: 1,
        productId: 1,
        sizeId: 1,
        designId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('parts', null, {}),
};
