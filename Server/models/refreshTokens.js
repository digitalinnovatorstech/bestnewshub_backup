module.exports = function (sequelize, DataTypes) {
  const refreshToken = sequelize.define(
    "refreshTokens",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "refreshTokens",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "_user",
          using: "BTREE",
          fields: [{ name: "_user" }],
        },
      ],
    }
  );
  refreshToken.associate = (models) => {
    refreshToken.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
  };
  return refreshToken;
};
