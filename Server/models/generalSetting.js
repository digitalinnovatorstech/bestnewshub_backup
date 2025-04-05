module.exports = (sequelize, DataTypes) => {
  const GeneralSetting = sequelize.define(
    "GeneralSetting",
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
      _defaultCategory: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      emailNotification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      notification: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      postNotification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      commentNotification: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      siteTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      siteTagline: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isTagline: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      siteLogo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      favicon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metaTags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      SEOImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "GeneralSetting",
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
        {
          name: "_defaultCategory",
          using: "BTREE",
          fields: [{ name: "_defaultCategory" }],
        },
        ,
      ],
    }
  );

  GeneralSetting.associate = (models) => {
    GeneralSetting.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "user",
    });
    GeneralSetting.belongsTo(models.Categories, {
      foreignKey: "_defaultCategory",
      as: "defaultCategory",
    });
  };

  return GeneralSetting;
};
