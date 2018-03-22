module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('design_sizes', [
      {
        imageUrl: 'https://js-static.nyc3.digitaloceanspaces.com/layouts/victim_10x40.jpg',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        sizeId: 1,
        designId: 1,
      },
      {
        imageUrl: 'https://js-static.nyc3.digitaloceanspaces.com/layouts/victim_8x12.jpg',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        sizeId: 2,
        designId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('design_sizes', null, {}),
};
