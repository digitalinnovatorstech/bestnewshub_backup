module.exports = (sequelize, DataTypes) => {
  const GoogleAds = sequelize.define(
    "GoogleAds",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      adsPosition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adsScript: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      page: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCustomAds: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "GoogleAds",
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

  GoogleAds.associate = (models) => {
    GoogleAds.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
  };
  return GoogleAds;
};
