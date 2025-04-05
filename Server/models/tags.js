module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("Tags", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
      defaultValue: "PUBLISHED",
      allowNull: true,
    },
    permalink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    _categories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  });

  Tags.associate = (models) => {
    Tags.belongsToMany(models.Posts, {
      through: "PostTags",
      foreignKey: "tagId",
      otherKey: "postId",
    });
  };

  return Tags;
};
