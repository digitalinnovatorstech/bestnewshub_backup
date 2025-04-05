"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "idType", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "idNumber", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "idUrls", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "qualification", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "houseNo", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "country", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "state", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "city", {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Users", "zipCode", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "streetName", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Users", "displayName", {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "idType");
    await queryInterface.removeColumn("Users", "idNumber");
    await queryInterface.removeColumn("Users", "qualification");
    await queryInterface.removeColumn("Users", "houseNo");
    await queryInterface.removeColumn("Users", "country");
    await queryInterface.removeColumn("Users", "state");
    await queryInterface.removeColumn("Users", "city");
    await queryInterface.removeColumn("Users", "zipCode");
    await queryInterface.removeColumn("Users", "streetName");
    await queryInterface.removeColumn("Users", "displayName");
  },
};
