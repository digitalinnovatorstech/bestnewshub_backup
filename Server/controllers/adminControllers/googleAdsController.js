const databases = require("../../config/database/databases");

const createAd = async (req, res) => {
  try {
    const { adsPosition, adsScript, page } = req.body;

    if (req.user.userType != "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create an ad",
      });
    }
    const newAd = await databases.googleAds.create({
      _user: req.user.id,
      adsPosition,
      adsScript,
      page: page?.toUpperCase(),
    });
    if (newAd) {
      return res.status(201).json({
        success: true,
        message: "Ad created successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Failed to create ad",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllGoodleAds = async (req, res) => {
  try {
    let position = req.query.position;
    let whereClause = {};
    if (position && position.toUpperCase() !== "ALL") {
      whereClause.page = position.toUpperCase();
    }
    const ads = await databases.googleAds.findAll({ where: whereClause });
    return res.status(200).json({
      success: true,
      data: ads || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdById = async (req, res) => {
  try {
    const ad = await databases.googleAds.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdByPage = async (req, res) => {
  try {
    let page = req.params.page;
    const ads = await databases.googleAds.findAll({
      where: { page: page.toUpperCase() },
    });
    return res.status(200).json({
      success: true,
      data: ads || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAd = async (req, res) => {
  try {
    const { adsPosition, adsScript } = req.body;
    const ad = await databases.googleAds.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    await ad.update({ adsPosition, adsScript });
    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await databases.googleAds.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    await ad.destroy();
    return res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeCustomAdsStatus = async (req, res) => {
  try {
    let { status } = req.query;
    const ad = await databases.googleAds.findByPk(req.query.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }
    await ad.update({ isCustomAds: status });
    status = req.query.status === "true";
    return res.status(200).json({
      success: true,
      message: status
        ? "Custom ads allow successfully."
        : "Custom ads stop successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAd,
  getAllGoodleAds,
  getAdById,
  updateAd,
  deleteAd,
  getAdByPage,
  changeCustomAdsStatus,
};
