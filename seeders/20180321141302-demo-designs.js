module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('designs', [
      {
        name: 'Victim',
        description: 'Join the Fight',
        imageUrl: 'https://js-static.nyc3.digitaloceanspaces.com/designs/victim-design.jpg',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: 1,
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('designs', null, {}),
};
