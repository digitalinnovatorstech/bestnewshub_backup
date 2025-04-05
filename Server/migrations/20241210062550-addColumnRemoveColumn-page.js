"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Pages", "publishedAt");
    await queryInterface.addColumn("Pages", "_user", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Pages", "publishedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.removeColumn("Pages", "_user");
  },
};
