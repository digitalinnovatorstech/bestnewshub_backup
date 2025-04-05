module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING", "REJECTED"),
        defaultValue: "PENDING",
      },
      metaTitle: {
        type: Sequelize.STRING,
      },
      metaDescription: {
        type: Sequelize.STRING,
      },
      permalink: {
        type: Sequelize.STRING,
      },
      isIndex: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      homeLayout: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      categoryLayout: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      SEOImageUrl: {
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
      publishedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      _user: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "Users",
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

    // Create postTags junction table
    await queryInterface.createTable("PostTags", {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tags",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Create postCategories junction table
    await queryInterface.createTable("PostCategories", {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("PostCategories");
    await queryInterface.dropTable("PostTags");
    await queryInterface.dropTable("Posts");
  },
};
