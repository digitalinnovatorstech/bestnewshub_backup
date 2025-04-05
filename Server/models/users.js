module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM(
          "ADMIN",
          "BLOGGER",
          "GUEST AUTHOR",
          "STAFF WRITER",
          "FREELANCE WRITER",
          "SUBSCRIBER"
        ),
        allowNull: true,
      },
      profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "PENDING"),
        allowNull: true,
        defaultValue: "ACTIVE",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isFirstLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      joiningDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      blogPostCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      idType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idUrls: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      houseNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      streetName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Users",
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
  Users.associate = (models) => {
    Users.hasOne(models.refreshTokens, {
      foreignKey: "_user",
      as: "refreshToken",
    });

    Users.hasMany(models.Comments, {
      foreignKey: "_user",
      as: "comments",
    });

    Users.hasMany(models.Posts, {
      foreignKey: "_user",
      as: "posts",
    });
    Users.hasMany(models.SavedPost, {
      foreignKey: "_user",
      as: "savedPosts",
    });
  };
  return Users;
};
