"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "totalComments", {
      allowNull: true,
      type: Sequelize.INTEGER,
    });

    await queryInterface.addColumn("Posts", "totalViews", {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "totalComments");
    await queryInterface.removeColumn("Posts", "totalViews");
  },
};
