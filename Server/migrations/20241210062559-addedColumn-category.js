"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Categories", "isHome", {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Categories", "index", {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Categories", "isHome");
    await queryInterface.removeColumn("Categories", "index");
  },
};
