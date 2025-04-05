const DataTypes = require("sequelize").DataTypes;
const _SequelizeMeta = require("./SequelizeMeta");
const _users = require("./users");
const _refreshTokens = require("./refreshTokens");
const _usersOtp = require("./usersOtp");
const _categories = require("./categories");
const _tags = require("./tags");
const _posts = require("./posts");
const _pages = require("./pages");
const _comments = require("./comments");
const _faq = require("./faq");
const _advertisement = require("./advertisement");
const _savedPosts = require("./savedPost");
const _userCategory = require("./userCategory");
const _generalSetting = require("./generalSetting");
const _notifications = require("./notifications");
const _socialMedia = require("./socialMedia");
const _googleAds = require("./googleAds");
const _enquiryUsers = require("./enquiryUsers");
const _appearance = require("./appearance");

function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);
  const refreshTokens = _refreshTokens(sequelize, DataTypes);
  const usersOtp = _usersOtp(sequelize, DataTypes);
  const categories = _categories(sequelize, DataTypes);
  const tags = _tags(sequelize, DataTypes);
  const posts = _posts(sequelize, DataTypes);
  const pages = _pages(sequelize, DataTypes);
  const comments = _comments(sequelize, DataTypes);
  const faq = _faq(sequelize, DataTypes);
  const advertisement = _advertisement(sequelize, DataTypes);
  const savedPosts = _savedPosts(sequelize, DataTypes);
  const userCategory = _userCategory(sequelize, DataTypes);
  const generalSetting = _generalSetting(sequelize, DataTypes);
  const notifications = _notifications(sequelize, DataTypes);
  const socialMedia = _socialMedia(sequelize, DataTypes);
  const googleAds = _googleAds(sequelize, DataTypes);
  const enquiryUsers = _enquiryUsers(sequelize, DataTypes);
  const appearance = _appearance(sequelize, DataTypes);

  categories.belongsToMany(posts, {
    through: "PostCategories",
    foreignKey: "categoryId",
    otherKey: "postId",
  });
  posts.belongsToMany(categories, {
    through: "PostCategories",
    foreignKey: "postId",
    otherKey: "categoryId",
  });
  posts.belongsToMany(tags, {
    through: "PostTags",
    foreignKey: "postId",
    otherKey: "tagId",
  });
  tags.belongsToMany(posts, {
    through: "PostTags",
    foreignKey: "tagId",
    otherKey: "postId",
  });
  refreshTokens.belongsTo(users, { foreignKey: "_user", as: "user" });
  users.hasOne(refreshTokens, { foreignKey: "_user", as: "refreshToken" });
  posts.belongsTo(users, { foreignKey: "_user", as: "author" });
  users.hasMany(posts, { foreignKey: "_user", as: "posts" });
  pages.belongsTo(users, { foreignKey: "_user", as: "author" });
  users.hasMany(pages, { foreignKey: "_user", as: "pages" });
  categories.hasMany(categories, {
    foreignKey: "_parentCategories",
    as: "children",
  });
  categories.belongsTo(categories, {
    foreignKey: "_parentCategories",
    as: "parent",
  });
  comments.belongsTo(users, { foreignKey: "_user", as: "creator" });
  users.hasMany(comments, { foreignKey: "_user", as: "comments" });
  comments.belongsTo(posts, { foreignKey: "_post", as: "post" });
  posts.hasMany(comments, { foreignKey: "_post", as: "comments" });
  faq.belongsTo(pages, { foreignKey: "_page", as: "page" });
  pages.hasMany(faq, { foreignKey: "_page", as: "FAQ" });
  faq.belongsTo(posts, { foreignKey: "_post", as: "post" });
  posts.hasMany(faq, { foreignKey: "_post", as: "FAQ" });
  savedPosts.belongsTo(users, { foreignKey: "_user", as: "user" });
  users.hasMany(savedPosts, { foreignKey: "_user", as: "savedPosts" });
  savedPosts.belongsTo(posts, { foreignKey: "_post", as: "post" });
  posts.hasMany(savedPosts, { foreignKey: "_post", as: "savedPosts" });
  userCategory.belongsTo(users, { foreignKey: "_user", as: "user" });
  users.hasMany(userCategory, { foreignKey: "_user", as: "userCategory" });
  userCategory.belongsTo(categories, {
    foreignKey: "_category",
    as: "categories",
  });
  categories.hasMany(userCategory, {
    foreignKey: "_category",
    as: "userCategory",
  });
  generalSetting.belongsTo(users, { foreignKey: "_user", as: "user" });
  users.hasMany(generalSetting, { foreignKey: "_user", as: "generalSetting" });
  generalSetting.belongsTo(categories, {
    foreignKey: "_defaultCategory",
    as: "defaultCategory",
  });
  categories.hasMany(generalSetting, {
    foreignKey: "_defaultCategory",
    as: "generalSetting",
  });
  notifications.belongsTo(users, { foreignKey: "_user", as: "user" });
  users.hasMany(notifications, { foreignKey: "_user", as: "notifications" });

  socialMedia.belongsTo(users, { foreignKey: "_user", as: "user" });
  googleAds.belongsTo(users, { foreignKey: "_user", as: "user" });
  appearance.belongsTo(users, { foreignKey: "_user", as: "user" });

  return {
    SequelizeMeta,
    users,
    refreshTokens,
    usersOtp,
    categories,
    tags,
    posts,
    pages,
    comments,
    faq,
    advertisement,
    savedPosts,
    userCategory,
    generalSetting,
    notifications,
    socialMedia,
    googleAds,
    enquiryUsers,
    appearance,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
