module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define("Categories", {
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
    status: {
      type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
      defaultValue: "PENDING",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    _parentCategories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    metaTags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isHome: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Categories.associate = (models) => {
    Categories.belongsToMany(models.Posts, {
      through: "PostCategories",
      foreignKey: "categoryId",
      otherKey: "postId",
    });
    Categories.hasMany(models.Categories, {
      as: "children",
      foreignKey: "_parentCategories",
    });

    Categories.belongsTo(models.Categories);
  };

  return Categories;
};
