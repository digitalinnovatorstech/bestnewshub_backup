module.exports = (sequelize, DataTypes) => {
  const EnquiryUsers = sequelize.define(
    "EnquiryUsers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contactType: {
        type: DataTypes.ENUM("ENQUIRY", "ADVERTISEMENT"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("NEW", "CONTACTED"),
        allowNull: false,
        defaultValue: "NEW",
      },
    },
    {
      sequelize,
      tableName: "EnquiryUsers",
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
  return EnquiryUsers;
};
