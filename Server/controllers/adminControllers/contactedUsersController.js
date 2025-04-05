const { Op } = require("sequelize");
const databases = require("../../config/database/databases");
const {
  userTemplate,
  adminTemplate,
} = require("../../mailTemplates/enquiryUserMail");
const { sendMail } = require("../../utils/userMailer");

const createEnquiryUser = async (req, res) => {
  try {
    const { name, email, message, contactType } = req.body;
    const newUserInfo = await databases.enquiryUsers.create({
      name,
      email: email.toLowerCase(),
      message,
      contactType: contactType?.toUpperCase(),
    });
    if (newUserInfo) {
      let userMessage = userTemplate(name, contactType?.toLowerCase());
      let userSub = `Thank You for Your Submission`;
      await sendMail(email, userSub, userMessage);
      let admins = await databases.users.findAll({
        where: { userType: "ADMIN" },
        include: [
          {
            model: databases.generalSetting,
            as: "generalSetting",
            where: {
              emailNotification: true,
            },
          },
        ],
      });

      let AdminSub = `New Enquiry Submission ${contactType} - ${name}`;
      for (let i = 0; i < admins?.length; i++) {
        const admin = admins[i];
        let adminMessage = adminTemplate(
          name,
          contactType?.toLowerCase(),
          email,
          message
        );
        await sendMail(admin.email, AdminSub, adminMessage);
        await databases.notifications.create({
          _user: admin.id,
          notificationsTitle: `New ${contactType?.toLowerCase()} Enquiry`,
          notificationContent: `A new ${contactType?.toLowerCase()} has been submitted by ${name}.`,
          permalink: `/enquiry/${
            contactType?.toLowerCase() === "enquiry"
              ? "contact"
              : contactType?.toLowerCase()
          }`,
        });
      }
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: newUserInfo,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEnquiryUsers = async (req, res) => {
  try {
    let { contactType, perPage, currentPage, searchQuery, status } = req.query;
    const limit = parseInt(perPage) || 10;
    const offset = ((parseInt(currentPage) || 1) - 1) * limit;
    let whereClause = {};
    if (contactType) {
      whereClause = { ...whereClause, contactType: contactType.toUpperCase() };
    }
    let totalUsers = await databases.enquiryUsers.count({
      where: whereClause,
    });
    if (searchQuery) {
      whereClause = {
        ...whereClause,
        name: { [Op.like]: `%${searchQuery}%` },
      };
    }
    if (status) {
      whereClause = {
        ...whereClause,
        status: status?.toUpperCase(),
      };
    }
    let users = await databases.enquiryUsers.findAll({
      where: whereClause,
      limit,
      offset,
    });
    const totalPages = Math.ceil(totalUsers / limit);
    return res.status(200).json({
      success: true,
      data: users || [],
      pagination: {
        totalItems: totalUsers || 0,
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

const getEnquiryUserById = async (req, res) => {
  try {
    let id = req.params.id;
    let user = await databases.enquiryUsers.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Enquiry User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEnquiryUser = async (req, res) => {
  try {
    let { ids, contactType } = req.body;
    let faildDeleteUsers = [];
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      let user = await databases.enquiryUsers.findByPk(id);
      if (!user) {
        faildDeleteUsers.push(id);
      }
      await user.destroy();
    }
    if (faildDeleteUsers?.length > 0) {
      return res.status(200).json({
        success: true,
        message: `${faildDeleteUsers.length} Enquiry Users not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `${ids.length} ${contactType} ${
        ids.length > 1 ? "Users" : "User"
      } deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeEnquiryUsersStatus = async (req, res) => {
  try {
    let ids = req.body;
    let faildUpdateUsers = [];
    if (!Array.isArray(ids)) {
      let user = await databases.enquiryUsers.findOne({
        where: { id: req.params.id },
      });
      if (!user) {
        faildUpdateUsers.push(ids);
      }
      await user.update({
        status: req.body.status,
      });
    } else {
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let user = await databases.enquiryUsers.findOne({
          where: { id: id },
        });
        if (!user) {
          faildUpdateUsers.push(id);
        }
        await user.update({
          status: req.body.status,
        });
      }
    }

    if (faildUpdateUsers?.length > 0) {
      return res.status(200).json({
        success: true,
        message: `${faildUpdateUsers.length} Enquiry Users not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Enquiry User status has been changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createEnquiryUser,
  getEnquiryUsers,
  getEnquiryUserById,
  deleteEnquiryUser,
  changeEnquiryUsersStatus,
};
