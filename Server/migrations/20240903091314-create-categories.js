("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Categories", {
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
      status: {
        type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PENDING",
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metaKeywords: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      _parentCategories: {
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
    await queryInterface.dropTable("Categories");
  },
};
