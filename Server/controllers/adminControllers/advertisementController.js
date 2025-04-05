const { Op } = require("sequelize");
const moment = require("moment");
const databases = require("../../config/database/databases");

const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      advertisementUrl,
      startDate,
      endDate,
      position,
    } = req.body;

    let adsInfo = await databases.advertisement.create({
      title,
      description,
      horizontalImageUrl: req.files?.horizontalImageUrl?.[0]?.location || null,
      verticalImageUrl: req.files?.verticalImageUrl?.[0]?.location || null,
      squareImageUrl: req.files?.squareImageUrl?.[0]?.location || null,
      advertisementUrl,
      startDate,
      endDate,
      position: position?.toUpperCase(),
    });
    if (adsInfo) {
      return res.status(201).json({
        success: true,
        message: "Advertisement created Successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Failed to create Ads",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAds = async (req, res) => {
  try {
    let { perPage, currentPage, startDate, endDate, status } = req.query;

    const limit = parseInt(perPage) || 10;
    const offset = ((parseInt(currentPage) || 1) - 1) * limit;

    let whereClause = {};

    if (startDate && endDate) {
      const start = moment.utc(startDate).startOf("day").toDate();
      const end = moment.utc(endDate).endOf("day").toDate();

      whereClause.startDate = {
        [Op.gte]: start,
      };
      whereClause.endDate = {
        [Op.lte]: end,
      };
    } else if (startDate) {
      const start = moment.utc(startDate).startOf("day").toDate();
      const end = moment.utc(startDate).endOf("day").toDate();

      whereClause.startDate = {
        [Op.gte]: start,
      };
      whereClause.endDate = {
        [Op.lte]: end,
      };
    } else if (endDate) {
      const end = moment.utc(endDate).endOf("day").toDate();
      whereClause.endDate = {
        [Op.lte]: end,
      };
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }
    let totalAdvertisements = await databases.advertisement.count({
      where: whereClause,
    });
    const advertisements = await databases.advertisement.findAll({
      where: whereClause,
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(totalAdvertisements / limit);

    return res.status(200).json({
      success: true,
      data: advertisements,
      pagination: {
        totalItems: totalAdvertisements,
        totalPages,
        currentPage: parseInt(currentPage) || 1,
        perPage: limit,
      },
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdsById = async (req, res) => {
  try {
    const advertisement = await databases.advertisement.findByPk(req.params.id);
    if (!advertisement) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    return res.status(200).json({ success: true, data: advertisement });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdsByPosition = async (req, res) => {
  try {
    const currentDate = moment().utc();
    const todayStart = currentDate
      .startOf("day")
      .format("YYYY-MM-DD[T]00:00:00[Z]");
    const todayEnd = currentDate
      .endOf("day")
      .format("YYYY-MM-DD[T]23:59:59[Z]");
    const advertisement = await databases.advertisement.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      // order: [["position", "ASC"]],
      where: {
        position: {
          [Op.like]: `%${req.params.position}%`,
        },
        startDate: {
          [Op.lte]: todayEnd,
        },
        endDate: {
          [Op.gte]: todayStart,
        },
      },
    });

    const advertisementHeader = await databases.advertisement.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        position: { [Op.like]: `%HEADER%` },
        startDate: {
          [Op.lte]: todayEnd,
        },
        endDate: {
          [Op.gte]: todayStart,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: advertisement,
      header: advertisementHeader,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAds = async (req, res) => {
  try {
    const advertisement = await databases.advertisement.findByPk(req.params.id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    const {
      title,
      description,
      advertisementUrl,
      startDate,
      endDate,
      status,
      position,
    } = req.body;

    await advertisement.update({
      title,
      description,
      horizontalImageUrl:
        req.files?.horizontalImageUrl?.[0]?.location ||
        advertisement.horizontalImageUrl,
      verticalImageUrl:
        req.files?.verticalImageUrl?.[0]?.location ||
        advertisement.verticalImageUrl,
      squareImageUrl:
        req.files?.squareImageUrl?.[0]?.location ||
        advertisement.squareImageUrl,
      advertisementUrl,
      startDate,
      endDate,
      status,
      position,
    });

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAds = async (req, res) => {
  try {
    const advertisement = await databases.advertisement.findByPk(req.params.id);
    if (!advertisement) {
      return res
        .status(404)
        .json({ success: false, message: "Advertisement not found" });
    }
    await advertisement.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Advertisement deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBulkAds = async (req, res) => {
  try {
    let ids = req.body.ids;
    let notFoundIds = [];
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      const advertisement = await databases.advertisement.findByPk(id);
      if (!advertisement) {
        notFoundIds.push(id);
      } else {
        await advertisement.destroy();
      }
    }
    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
      notFoundIds: notFoundIds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createAdvertisement,
  getAllAds,
  getAdsById,
  getAdsByPosition,
  updateAds,
  deleteAds,
  deleteBulkAds,
};
