module.exports = (sequelize, DataTypes) => {
  const UserCategory = sequelize.define(
    "UserCategory",
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
      _category: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "UserCategory",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "_category",
          using: "BTREE",
          fields: [{ name: "_category" }],
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

  UserCategory.associate = (models) => {
    UserCategory.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
    UserCategory.belongsTo(models.Categories, {
      foreignKey: "_category",
      as: "category",
    });
  };

  return UserCategory;
};
