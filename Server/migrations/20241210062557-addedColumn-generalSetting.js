"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("GeneralSetting", "SEOImageUrl", {
      allowNull: true,
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("GeneralSetting", "SEOImageUrl");
  },
};
