module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('csrs', [
      {
        firstName: 'Metromedia',
        lastName: 'Technologies',
        email: 'info@mmt.com',
        phone: '1-800-999-4668',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete('csrs', null, {}),
};
