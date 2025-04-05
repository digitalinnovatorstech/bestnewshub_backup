"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GeneralSetting", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      _user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      _defaultCategory: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      emailNotification: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      notification: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      postNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      commentNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      siteTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      siteTagline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isTagline: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      siteLogo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      favicon: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("GeneralSetting");
  },
};
