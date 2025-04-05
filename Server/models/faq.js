module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define(
    "FAQ",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      _post: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      _page: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Pages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      tableName: "FAQ",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "_post",
          using: "BTREE",
          fields: [{ name: "_post" }],
        },
        {
          name: "_page",
          using: "BTREE",
          fields: [{ name: "_page" }],
        },
      ],
    }
  );

  FAQ.associate = (models) => {
    FAQ.belongsTo(models.Pages, {
      foreignKey: "_page",
      as: "page",
    });
    FAQ.belongsTo(models.Posts, {
      foreignKey: "_post",
      as: "post",
    });
  };

  return FAQ;
};
