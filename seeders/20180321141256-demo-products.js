module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('products', [
      {
        name: 'Bulletin',
        description: 'High impact Out Of Home product.',
        imageUrl: 'https://js-static.nyc3.digitaloceanspaces.com/products/bulletin-product.jpg',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('products', null, {}),
};
