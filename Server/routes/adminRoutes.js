const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  resetPasswordByAdmin,
  forgotPasswordSendOtp,
  otpVerification,
  resetPassword,
  updateUser,
  bulkActionUser,
} = require("../controllers/adminControllers/authController");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesList,
  getPopularCategoriesList,
  getCategoryByUser,
  changeCategoryIndex,
  addCategoryToHome,
  deleteCategoryFromHome,
} = require("../controllers/adminControllers/categoryController");
const {
  createTag,
  getAllTags,
  getTagById,
  removeTags,
  updateTags,
  getTagsList,
} = require("../controllers/adminControllers/tagsController");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  bulkAction,
} = require("../controllers/adminControllers/postsController");
const {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  bulkDelete,
} = require("../controllers/adminControllers/pagesController");
const {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  bulkActionOnComment,
} = require("../controllers/adminControllers/commentsController");
const upload = require("../middlewares/upload");
const { auth } = require("../middlewares/auth");
const {
  getTotalPostCount,
  getOverview,
  getPostsBarChart,
  getRunningAds,
  getRecentComments,
} = require("../controllers/adminControllers/dashboardController");
const {
  createAdvertisement,
  getAdsById,
  getAdsByPosition,
  updateAds,
  deleteAds,
  getAllAds,
  deleteBulkAds,
} = require("../controllers/adminControllers/advertisementController");
const {
  getCommentsByUser,
} = require("../controllers/landingControllers/commentsController");
const {
  updateGeneralSetting,
  getGeneralSetting,
} = require("../controllers/landingControllers/authController");
const {
  readNotifications,
  getAllNotification,
  getNewNotification,
  deleteNotifications,
} = require("../controllers/landingControllers/notificationsController");
const {
  createSocialMedia,
  getAllSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  getSocialMedia,
} = require("../controllers/adminControllers/socialMediaController");
const {
  createAd,
  getAdById,
  updateAd,
  deleteAd,
  getAllGoodleAds,
  getAdByPage,
  changeCustomAdsStatus,
} = require("../controllers/adminControllers/googleAdsController");
const {
  createEnquiryUser,
  getEnquiryUsers,
  getEnquiryUserById,
  changeEnquiryUsersStatus,
  deleteEnquiryUser,
} = require("../controllers/adminControllers/contactedUsersController");
const {
  updateAppearance,
  getAllAppearances,
  deleteAppearances,
} = require("../controllers/adminControllers/appearance");
const router = express.Router();

/*====================================================================================================
  =====================================  Auth Routes  ============================================ 
====================================================================================================*/
router.post("/login/user", loginUser);
router.get("/reset/password/otp/:email", forgotPasswordSendOtp);
router.post("/reset/password/otp/verify", otpVerification);
router.put("/reset/password", resetPassword);
router.put("/users/:userId/reset-password", auth, resetPasswordByAdmin);

/*====================================================================================================
  =====================================  User Routes  ============================================ 
====================================================================================================*/
router.post("/create/user", auth, upload.single("profilePhoto"), createUser);
router.get("/user/getAll", auth, getUsers);
router.get("/user/getById/:id", auth, getUserById);
router.put("/user/update/:id", auth, upload.single("profilePhoto"), updateUser);
router.delete("/user/delete/:id", auth, deleteUser);
router.put("/user/bulk/actionUser", auth, bulkActionUser);

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
router.post("/category/create", auth, createCategory);
router.get("/category/getAll", auth, getAllCategories);
router.get("/allCategory/list", auth, getAllCategoriesList);
router.get("/category/popular", auth, getPopularCategoriesList);
router.get("/category/getById/:id", auth, getCategoryById);
router.put("/category/update/:id", auth, updateCategory);
router.delete("/category/delete/:id", auth, deleteCategory);
router.get("/category/user/findAll", auth, getCategoryByUser);
router.put("/category/home/changePosition", auth, changeCategoryIndex);
router.post("/category/home/add", auth, addCategoryToHome);
router.post("/category/home/remove", auth, deleteCategoryFromHome);
/*====================================================================================================
  =====================================  Tags Routes  ============================================ 
====================================================================================================*/
router.post("/tags/create", auth, createTag);
router.get("/tags/getAll", auth, getAllTags);
router.get("/tags/list", auth, getTagsList);

router.get("/tags/getById/:id", auth, getTagById);
router.put("/tags/update/:id", auth, updateTags);
router.delete("/tags/delete/:id", auth, removeTags);
router.put("/tags/bulk/delete", auth, removeTags);
/*====================================================================================================
  =====================================  Posts Routes  ============================================ 
====================================================================================================*/

router.post(
  "/posts/create",
  upload.fields([
    { name: "SEOImageUrl", maxCount: 1 },
    { name: "faqFile", maxCount: 1 },
    { name: "verticalImageUrl", maxCount: 1 },
    { name: "squareImageUrl", maxCount: 1 },
  ]),
  auth,
  createPost
);

router.get("/posts/getAll", auth, getPosts);
router.get("/posts/getById/:id", auth, getPostById);
router.put(
  "/posts/update/:id",
  upload.fields([
    { name: "SEOImageUrl", maxCount: 1 },
    { name: "faqFile", maxCount: 1 },
    { name: "verticalImageUrl", maxCount: 1 },
    { name: "squareImageUrl", maxCount: 1 },
  ]),
  auth,
  updatePost
);
router.delete("/posts/delete/:id", auth, deletePost);
router.put("/post/multiple/update/remove", auth, bulkAction);

/*====================================================================================================
  =====================================  Pages Routes  ============================================ 
====================================================================================================*/
router.post(
  "/pages/create",
  upload.fields([
    { name: "SEOImageUrl", maxCount: 1 },
    { name: "faqFile", maxCount: 1 },
  ]),
  auth,
  createPage
);
router.get("/pages/getAll", auth, getPages);
router.get("/pages/getById/:id", auth, getPageById);
router.put(
  "/pages/update/:id",
  auth,
  upload.fields([
    { name: "SEOImageUrl", maxCount: 1 },
    { name: "faqFile", maxCount: 1 },
  ]),
  updatePage
);
router.delete("/pages/delete/:id", auth, deletePage);
router.put("/pages/bulk/delete", auth, bulkDelete);

/*====================================================================================================
  =====================================  Comments Routes  ============================================ 
====================================================================================================*/
router.post("/comments/create", auth, createComment);
router.get("/comments/getAll", auth, getComments);
router.get("/comments/getById/:id", auth, getCommentById);
router.put("/comments/update/:id", auth, updateComment);
router.delete("/comments/delete/:id", auth, deleteComment);
router.put("/comments/multiple/update/remove", auth, bulkActionOnComment);
router.get("/comments/user/findAll", getCommentsByUser);

/*====================================================================================================
======================================  Comments Routes  ============================================ 
====================================================================================================*/

router.get("/dashboard/overview", auth, getTotalPostCount);
router.get("/dashboard/overview/comments", auth, getOverview);
router.get("/dashboard/posts/barchart", auth, getPostsBarChart);
router.get("/dashboard/ads/getRunning", auth, getRunningAds);
router.get("/dashboard/ads/recentComments", auth, getRecentComments);

/*====================================================================================================
======================================  Ads Routes  ============================================ 
====================================================================================================*/

router.post(
  "/advertisement/create",
  auth,
  upload.fields([
    { name: "horizontalImageUrl", maxCount: 1 },
    { name: "verticalImageUrl", maxCount: 1 },
    { name: "squareImageUrl", maxCount: 1 },
  ]),
  createAdvertisement
);
router.get("/advertisement/getAll", auth, getAllAds);
router.get("/advertisement/getById/:id", auth, getAdsById);
router.put(
  "/advertisement/update/:id",
  auth,
  upload.fields([
    { name: "horizontalImageUrl", maxCount: 1 },
    { name: "verticalImageUrl", maxCount: 1 },
    { name: "squareImageUrl", maxCount: 1 },
  ]),
  updateAds
);
router.delete("/advertisement/delete/:id", auth, deleteAds);
router.put("/advertisement/delete/bulk", auth, deleteBulkAds); // as per Frontend developer requirment

router.put("/notifications/read/:id", auth, readNotifications);
router.get("/notification/getAll", auth, getAllNotification);
router.get("/notification/getNew", auth, getNewNotification);
router.delete("/notification/delete", auth, deleteNotifications);

router.post("/social-media", auth, createSocialMedia);
router.get("/social-media/getAll", auth, getAllSocialMedia);
router.get("/social-media/:id", auth, getSocialMedia);
router.put("/social-media/:id", auth, updateSocialMedia);
router.delete("/social-media/:id", auth, deleteSocialMedia);

router.post("/googleAds", auth, auth, createAd);
router.get("/googleAds", auth, getAllGoodleAds);
router.get("/googleAds/:id", auth, getAdById);
router.get("/googleAds/getByPage/:page", auth, getAdByPage);
router.put("/googleAds/:id", auth, updateAd);
router.delete("/googleAds/:id", auth, deleteAd);
router.put("/googleAd/changeStatus", auth, changeCustomAdsStatus);

router.get("/enquiry/getAll", auth, getEnquiryUsers);
router.get("/enquiry/getById/:id", auth, getEnquiryUserById);
router.put("/enquiry/update/:id", auth, changeEnquiryUsersStatus);
router.put("/enquiry/delete", auth, deleteEnquiryUser);

router.post(
  "/setting/appearance/add",
  auth,
  upload.fields([
    { name: "featureImageUrl", maxCount: 1 },
    { name: "siteLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateAppearance
);
router.get("/setting/appearance/get", auth, getAllAppearances);
router.delete("/setting/appearance/:id", auth, deleteAppearances);

module.exports = router;
