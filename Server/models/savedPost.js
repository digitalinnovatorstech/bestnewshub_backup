module.exports = (sequelize, DataTypes) => {
  const SavedPost = sequelize.define(
    "SavedPost",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    },
    {
      sequelize,
      tableName: "SavedPost",
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
          name: "_user",
          using: "BTREE",
          fields: [{ name: "_user" }],
        },
        ,
      ],
    }
  );

  SavedPost.associate = (models) => {
    SavedPost.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
    SavedPost.belongsTo(models.Posts, {
      foreignKey: "_post",
      as: "post",
    });
  };

  return SavedPost;
};
