module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    "Notifications",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      _user: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notificationsTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notificationContent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permalink: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "Notifications",
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

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
  };
  return Notifications;
};
