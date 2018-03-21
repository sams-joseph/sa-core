module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('design_sizes', [
      {
        imageUrl: 'http://res.cloudinary.com/jsams/image/upload/v1519925324/victim_10x40_xg7ezw.jpg',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        sizeId: 1,
        designId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('design_sizes', null, {}),
};
