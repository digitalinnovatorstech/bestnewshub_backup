"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Advertisements", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      horizontalImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      verticalImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      squareImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      advertisementUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Advertisements");
  },
};
