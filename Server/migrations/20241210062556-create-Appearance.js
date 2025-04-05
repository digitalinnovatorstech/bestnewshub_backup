"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Appearance", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      src: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      customCSS: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      customJS: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      // metaTitle: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // metaDescription: {
      //   type: Sequelize.TEXT,
      //   allowNull: true,
      // },
      // metaTags: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // siteTitle: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // siteTagline: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // featureImageUrl: {
      //   type: Sequelize.TEXT,
      //   allowNull: true,
      // },
      // siteLogo: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // favicon: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      _user: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("Appearance");
  },
};
