module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('orders', [
      {
        shippingName: 'MMT',
        shippingAddress: 'address',
        shippingCity: 'city',
        shippingState: 'state',
        shippingZip: 44691,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('orders', null, {}),
};
