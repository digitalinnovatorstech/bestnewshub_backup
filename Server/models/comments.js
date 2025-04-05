module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "APPROVED",
          "REJECTED",
          "SPAM",
          "FLAGGED"
        ),
        allowNull: true,
        defaultValue: "PENDING",
      },
      _post: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "Comments",
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
        {
          name: "_user",
          using: "BTREE",
          fields: [{ name: "_user" }],
        },
        ,
      ],
    }
  );

  Comments.associate = (models) => {
    Posts.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "creator",
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: "_post",
      as: "post",
    });
  };

  return Comments;
};
