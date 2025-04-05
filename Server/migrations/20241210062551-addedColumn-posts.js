"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "tempPermalink", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Posts", "metaTags", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Posts", "showingCategies", {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "tempPermalink");
    await queryInterface.removeColumn("Posts", "metaTags");
    await queryInterface.removeColumn("Posts", "showingCategies");
  },
};
