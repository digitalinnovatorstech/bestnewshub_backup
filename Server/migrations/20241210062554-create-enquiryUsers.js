"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("EnquiryUsers", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contactType: {
        type: Sequelize.ENUM("ENQUIRY", "ADVERTISEMENT"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("NEW", "CONTACTED"),
        allowNull: false,
        defaultValue: "NEW",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("EnquiryUsers");
  },
};
