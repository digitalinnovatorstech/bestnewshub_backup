const express = require("express");
const {
  createUser,
  loginUser,
  getUserById,
  resetPasswordByAdmin,
  forgotPasswordSendOtp,
  otpVerification,
  resetPassword,
  updateUser,
  updateGeneralSetting,
  getGeneralSetting,
  emailVerifyOTP,
} = require("../controllers/landingControllers/authController");
const {
  getAllCategories,
  getCategoryById,
  getPopularCategoriesList,
  getAllCategoriesForHeader,
  getCategory,
  getCategoryBySlug,
  getCategories,
  getHomePageCategory,
} = require("../controllers/landingControllers/categoryController");
const {
  getAllTags,
  getTagById,
  removeTags,
  updateTags,
  getTagsList,
} = require("../controllers/landingControllers/tagsController");
const {
  getHeroSection,
  getPostById,
  getHomePagePosts,
  getMorePosts,
  getPostsByCategory,
  createSavedPost,
  getSavedPostsByUser,
  deleteSavedPost,
  getSearchPosts,
  getPostByPermalink,
  getMetaInfo,
  getLogo,
  getPostSEOInfo,
  getPosts,
  getPostsByTag,
  getHomePosts,
} = require("../controllers/landingControllers/postsController");

const {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/landingControllers/commentsController");
const upload = require("../middlewares/upload");
const { auth } = require("../middlewares/auth");
const {
  getAdsByPosition,
} = require("../controllers/adminControllers/advertisementController");
const {
  readNotifications,
  getAllNotification,
  deleteNotifications,
  getNewNotification,
} = require("../controllers/landingControllers/notificationsController");
const {
  getPages,
  getPageById,
  getPagesByPermalink,
  getPagesSEOInfoByPermalink,
  getAllPages,
} = require("../controllers/landingControllers/pagesController");
const {
  createEnquiryUser,
} = require("../controllers/adminControllers/contactedUsersController");
const {
  getAllAppearancesLanding,
} = require("../controllers/adminControllers/appearance");
const router = express.Router();

/*====================================================================================================
  =====================================  Auth Routes  ============================================ 
====================================================================================================*/
router.post("/login/user", loginUser);
router.get("/reset/password/otp/:email", auth, forgotPasswordSendOtp);
router.post("/reset/password/otp/verify", auth, otpVerification);
router.put("/reset/password", auth, resetPassword);
router.put("/users/:userId/reset-password", auth, resetPasswordByAdmin);
router.post("/user/verifyEmail", auth, emailVerifyOTP);
router.post("/user/email/otp/verify", auth, otpVerification);

/*====================================================================================================
  =====================================  User Routes  ============================================ 
====================================================================================================*/
router.post(
  "/create/user",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "frontSide", maxCount: 1 },
    { name: "backSide", maxCount: 1 },
  ]),
  auth,
  createUser
);
router.get("/user/getById/:id", auth, getUserById);
router.put(
  "/user/update/:id",
  auth,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "frontSide", maxCount: 1 },
    { name: "backSide", maxCount: 1 },
  ]),
  updateUser
);

router.put(
  "/setting/general",
  upload.fields([
    { name: "siteLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "SEOImageUrl", maxCount: 1 },
  ]),
  auth,
  updateGeneralSetting
);
router.get("/setting/general", auth, getGeneralSetting);

/*====================================================================================================
  ======================================  Category Routes  =========================================
====================================================================================================*/
router.get("/category/getAll", auth, getAllCategories);
router.get("/category/header", auth, getAllCategoriesForHeader);
router.get("/category/popular", auth, getPopularCategoriesList);
router.get("/category/getById/:id", auth, getCategoryById);
router.get("/category/getBySlug/", auth, getCategoryBySlug);
router.get("/category/getAll/slugs", getCategories);
router.get("/category/home/getCategory", auth, getHomePageCategory);

/*====================================================================================================
  =====================================  Tags Routes  ============================================ 
====================================================================================================*/
router.get("/tags/getAll", auth, getAllTags);
router.get("/tags/list", auth, getTagsList);
router.get("/tags/getById/:id", auth, getTagById);
router.put("/tags/update/:id", auth, updateTags);
router.delete("/tags/delete/:id", auth, removeTags);

/*====================================================================================================
  =====================================  Posts Routes  ============================================ 
====================================================================================================*/

router.get("/posts/home/heroSection", auth, getHeroSection);
router.get("/posts/homePage", auth, getHomePagePosts);
router.get("/posts/morePosts", auth, getMorePosts);
router.get("/posts/getById/:id", auth, getPostById);
router.get("/posts/getByCategory/:id", auth, getPostsByCategory);
router.get("/posts/getSeachPosts", auth, getSearchPosts);
router.get("/posts/getByPermalink/", auth, getPostByPermalink);
router.get("/posts/seo/getByPermalink", getPostSEOInfo);
router.get("/posts/getAll", getPosts);
router.get("/posts/getByTag", getPostsByTag);
router.get("/posts/home/getByCategory/:id", getHomePosts);

router.get("/pages/getAll", auth, getPages);
router.get("/pages/getByPermalink", auth, getPagesByPermalink);
router.get("/pages/seo/getByPermalink", getPagesSEOInfoByPermalink);
router.get("/pages/getById/:id", auth, getPageById);
router.get("/pages/getAll/slugs", getAllPages);

/*====================================================================================================
  =====================================  Comments Routes  ============================================ 
====================================================================================================*/
router.post("/comments/create", auth, createComment);
router.get("/comments/getAll", auth, getComments);
router.get("/comments/getById/:id", auth, getCommentById);
router.put("/comments/update/:id", auth, updateComment);
router.delete("/comments/delete/:id", auth, deleteComment);
router.get("/advertisement/position/:position", auth, getAdsByPosition);

/*====================================================================================================
  =====================================  Saved Posts Routes  ============================================ 
====================================================================================================*/

router.post("/savedPost/create", auth, createSavedPost);
router.get("/savedPosts/getAll", auth, getSavedPostsByUser);
router.delete("/savedPost/delete/:id", auth, deleteSavedPost);

/*====================================================================================================
  ===================================== Notifications Routes  ============================================ 
====================================================================================================*/
router.put("/notifications/read/:id", auth, readNotifications);
router.get("/notification/getAll", auth, getAllNotification);
router.get("/notification/getNew", auth, getNewNotification);
router.put("/notification/delete", auth, deleteNotifications);

router.post("/enquiry/create", auth, createEnquiryUser);
router.get("/home/getMetaInfo", getMetaInfo);
router.get("/category/metaInfo", getCategory);

router.get("/global/siteLogo", auth, getLogo);
router.get("/setting/appearance/get", auth, getAllAppearancesLanding);

module.exports = router;
