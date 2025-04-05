const databases = require("../../config/database/databases");

const createSocialMedia = async (req, res) => {
  try {
    const { title, iconName, url } = req.body;
    let isExist = await databases.socialMedia.findOne({ where: { url } });
    if (isExist) {
      return res.status(400).json({
        status: false,
        message: "Social media already exists",
      });
    }
    const socialMedia = await databases.socialMedia.create({
      title,
      iconName,
      url,
      _user: req.user.id,
    });
    return res.status(201).json({
      status: true,
      message: "Social media created successfully",
      data: socialMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

const getAllSocialMedia = async (req, res) => {
  try {
    const socialMediaList = await databases.socialMedia.findAll({});
    return res.status(202).json({
      success: true,
      data: socialMediaList || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

const getSocialMedia = async (req, res) => {
  try {
    const socialMediaList = await databases.socialMedia.findOne({
      where: { id: req.params.id },
    });
    return res.status(202).json({
      success: true,
      data: socialMediaList || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

const updateSocialMedia = async (req, res) => {
  try {
    let id = req.params.id;
    const socialMediaList = await databases.socialMedia.findByPk(id);
    if (!socialMediaList) {
      return res.status(404).json({
        success: true,
        message: "Record not found",
      });
    }
    await socialMediaList.update(req.body);
    return res.status(202).json({
      success: true,
      message: "Social media updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

const deleteSocialMedia = async (req, res) => {
  try {
    let id = req.params.id;
    const socialMediaList = await databases.socialMedia.findByPk(id);
    if (!socialMediaList) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }
    await socialMediaList.destroy();
    return res.status(202).json({
      success: true,
      message: "Social media deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

module.exports = {
  createSocialMedia,
  getAllSocialMedia,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
