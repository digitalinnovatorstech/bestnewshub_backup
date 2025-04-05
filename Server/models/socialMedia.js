module.exports = (sequelize, DataTypes) => {
  const SocialMedia = sequelize.define(
    "SocialMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      _user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      iconName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "SocialMedia",
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

  SocialMedia.associate = (models) => {
    SocialMedia.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
  };
  return SocialMedia;
};
