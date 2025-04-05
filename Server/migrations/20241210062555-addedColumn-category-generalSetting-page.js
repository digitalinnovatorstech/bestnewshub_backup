"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Categories", "metaTags", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Pages", "metaTags", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("GeneralSetting", "metaTitle", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("GeneralSetting", "metaDescription", {
      allowNull: true,
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("GeneralSetting", "metaTags", {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Categories", "metaTags");
    await queryInterface.removeColumn("Pages", "metaTags");
    await queryInterface.removeColumn("GeneralSetting", "metaTitle");
    await queryInterface.removeColumn("GeneralSetting", "metaDescription");
    await queryInterface.removeColumn("GeneralSetting", "metaTags");
  },
};
