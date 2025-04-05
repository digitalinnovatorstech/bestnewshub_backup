module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING", "REJECTED"),
      defaultValue: "PENDING",
    },
    metaTitle: {
      type: DataTypes.STRING,
    },
    metaDescription: {
      type: DataTypes.STRING,
    },
    permalink: {
      type: DataTypes.STRING,
    },
    isIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    homeLayout: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    categoryLayout: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    SEOImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verticalImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    squareImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    totalComments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalViews: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    tempPermalink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaTags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showingCategies: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsToMany(models.Tags, {
      through: "PostTags",
      foreignKey: "postId",
      otherKey: "tagId",
    });
    Posts.belongsToMany(models.Categories, {
      through: "PostCategories",
      foreignKey: "postId",
      otherKey: "categoryId",
    });

    Posts.belongsTo(models.Users, {
      foreignKey: "_user",
      as: "author",
    });
    Posts.hasMany(models.Comments, {
      foreignKey: "_post",
      as: "comments",
    });
    Posts.hasMany(models.FAQ, {
      foreignKey: "_post",
      as: "FAQ",
    });
    Posts.hasMany(models.SavedPost, {
      foreignKey: "_post",
      as: "savedPosts",
    });
  };

  return Posts;
};
