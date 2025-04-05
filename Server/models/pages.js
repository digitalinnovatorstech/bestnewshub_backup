module.exports = (sequelize, DataTypes) => {
  const Pages = sequelize.define(
    "Pages",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pageName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PENDING",
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permalink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      SEOImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      _user: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      metaTags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Pages",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  Pages.associate = (models) => {
    Pages.hasMany(models.FAQ, {
      foreignKey: "_page",
      as: "FAQ",
    });
    Pages.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "author",
    });
  };

  return Pages;
};
