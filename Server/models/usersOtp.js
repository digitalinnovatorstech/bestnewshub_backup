module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "UsersOtp",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "UsersOtp",
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
};
