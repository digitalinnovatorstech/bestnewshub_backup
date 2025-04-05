const { Op, literal, fn, col } = require("sequelize");
const databases = require("../../config/database/databases");
const moment = require("moment");

const getTotalPostCount = async (req, res) => {
  try {
    let whereClause = {
      attributes: ["id", "title", "startDate", "endDate", "position"],
      status: "PUBLISHED",
    };
    if (req.user.userType != "ADMIN") {
      whereClause._user = req.user.id;
    }
    const totalPostCount = await databases.posts.count({
      whereClause,
    });
    const totalAuthors = await databases.users.count({
      where: {
        userType: {
          [Op.ne]: "ADMIN",
        },
        status: "ACTIVE",
      },
    });
    const totalSubscriber = await databases.users.count({
      where: {
        userType: "SUBSCRIBER",
      },
    });
    return res.status(200).json({
      success: true,
      data: { totalPostCount, totalAuthors, totalSubscriber },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);
    const last14Days = new Date();
    last14Days.setDate(last7Days.getDate() - 7);
    let whereClause7Days = {
      createdAt: {
        [Op.between]: [last7Days, now],
      },
    };
    let whereClause14Days = {
      createdAt: {
        [Op.between]: [last14Days, last7Days],
      },
    };
    if (req.user.userType !== "ADMIN") {
      whereClause7Days._post = {
        [Op.in]: literal(`(SELECT id FROM Posts WHERE _user = ${req.user.id})`),
      };

      whereClause14Days._post = {
        [Op.in]: literal(`(SELECT id FROM Posts WHERE _user = ${req.user.id})`),
      };
    }

    const getLast7DaysComments = await databases.comments.count({
      whereClause7Days,
    });
    const getLast14DaysComments = await databases.comments.count({
      whereClause14Days,
    });
    let diff = getLast7DaysComments - getLast14DaysComments;

    return res.status(200).json({
      success: true,
      data: { getLast7DaysComments, diff },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostsBarChart = async (req, res) => {
  try {
    const { filterType } = req.query;

    let startDate = new Date();
    let endDate = new Date();
    let groupBy = null;
    let labels = [];

    if (filterType === "WEEKLY" || !filterType) {
      startDate.setDate(startDate.getDate() - 7);
      groupBy = literal("DATE(`publishedAt`)");

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        labels.push(d.toISOString().split("T")[0]);
      }
    } else if (filterType === "MONTHLY") {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      groupBy = literal("WEEK(`publishedAt`)");

      let current = new Date(startDate);
      while (current <= endDate) {
        const weekNumber = Math.ceil(current.getDate() / 7);
        labels.push(`Week ${weekNumber}`);
        current.setDate(current.getDate() + 7);
      }
    } else if (filterType === "YEARLY") {
      startDate = new Date(startDate.getFullYear(), 0, 1);
      endDate = new Date(startDate.getFullYear(), 11, 31);
      groupBy = literal("MONTH(`publishedAt`)");

      for (let m = 0; m < 12; m++) {
        labels.push(
          new Date(startDate.getFullYear(), m, 1).toLocaleString("default", {
            month: "long",
          })
        );
      }
    }

    const records = await databases.posts.findAll({
      attributes: [
        [groupBy, "groupByPeriod"],
        [fn("COUNT", col("id")), "totalRecords"],
      ],
      where: {
        publishedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["groupByPeriod"],
      order: [[literal("groupByPeriod"), "ASC"]],
    });
    const dataLookup = {};
    records.forEach((record) => {
      const key = record.dataValues.groupByPeriod.toString();
      dataLookup[key] = record.dataValues.totalRecords;
    });

    const formattedData = labels.map((label, index) => {
      let matchingKey;
      if (filterType === "MONTHLY") {
        matchingKey = (index + 1).toString();
      } else if (filterType === "YEARLY") {
        matchingKey = (index + 1).toString();
      } else {
        matchingKey = label;
      }

      return {
        period: label,
        totalRecords: dataLookup[matchingKey] || 0,
      };
    });

    return res.status(200).json({
      success: true,
      filterType: filterType || "WEEKLY",
      data: formattedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRunningAds = async (req, res) => {
  try {
    let { perPage, currentPage, status } = req.query;

    const limit = parseInt(perPage) || 10;
    const offset = ((parseInt(currentPage) || 1) - 1) * limit;

    let whereClause = {};
    const currentDate = moment().utc().toDate();
    whereClause.startDate = {
      [Op.lte]: currentDate,
    };
    whereClause.endDate = {
      [Op.gte]: currentDate,
    };

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentComments = async (req, res) => {
  try {
    let { userId, perPage, currentPage } = req.query;
    userId = userId ? userId : req.user.id;

    const limit = parseInt(perPage) || 10;
    const offset = ((parseInt(currentPage) || 1) - 1) * limit;

    let conditions = {
      order: [["createdAt", "DESC"]],
      where: {},
      include: [
        {
          model: databases.users,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email", "profilePhoto"],
        },
        {
          model: databases.posts,
          as: "post",
          attributes: ["id", "metaTitle", "permalink"],
        },
      ],
      limit: limit,
      offset: offset,
    };

    if (req.user.userType !== "ADMIN") {
      conditions.where._user = userId;
    }

    const { rows: comments, count: totalComments } =
      await databases.comments.findAndCountAll(conditions);

    const totalPages = Math.ceil(totalComments / limit);

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        totalItems: totalComments,
        totalPages,
        currentPage: parseInt(currentPage) || 1,
        perPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTotalPostCount,
  getPostsBarChart,
  getOverview,
  getRunningAds,
  getRecentComments,
};
