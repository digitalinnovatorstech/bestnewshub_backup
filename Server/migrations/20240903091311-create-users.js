("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "PENDING"),
        allowNull: true,
        defaultValue: "ACTIVE",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isFirstLogin: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      joiningDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      blogPostCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
