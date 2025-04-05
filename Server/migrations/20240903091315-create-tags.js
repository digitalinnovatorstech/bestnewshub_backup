("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PUBLISHED",
        allowNull: true,
      },
      permalink: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      _categories: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tags");
  },
};
