module.exports = (sequelize, DataTypes) => {
  const Appearance = sequelize.define(
    "Appearance",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      src: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      customCSS: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      customJS: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      // metaTitle: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // metaDescription: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // metaTags: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // siteTitle: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // siteTagline: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // featureImageUrl: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // siteLogo: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // favicon: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      _user: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      tableName: "Appearance",
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

  Appearance.associate = (models) => {
    Appearance.belongsTo(models.Users, {
      as: "user",
      foreignKey: "_user",
    });
  };

  return Appearance;
};
