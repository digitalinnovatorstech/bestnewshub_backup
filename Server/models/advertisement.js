module.exports = (sequelize, DataTypes) => {
  const Advertisement = sequelize.define(
    "Advertisement",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      horizontalImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verticalImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      squareImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      advertisementUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      position: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Advertisements",
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

  return Advertisement;
};
