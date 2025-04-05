const databases = require("../../config/database/databases");

const readNotifications = async (req, res) => {
  try {
    let id = req.params.id;

    let notifications = await databases.notifications.findByPk(id);
    if (!notifications) {
      return res.status(404).json({
        success: true,
        message: "Notification not found",
      });
    }
    await notifications.update({
      isRead: true,
    });

    return res.status(200).json({
      success: true,
      message: "Notification read successfully",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    let ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: Please provide an array of IDs.",
      });
    }
    const deletedCount = await databases.notifications.destroy({
      where: { id: ids },
    });

    if (deletedCount) {
      return res.status(200).json({
        success: true,
        message: `${deletedCount} Notifications deleted successfully`,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Faild to delete Notification",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllNotification = async (req, res) => {
  try {
    let notifications = await databases.notifications.findAll({
      where: { _user: req.user.id },
      order: [["createdAt", "DESC"]],
      raw: true,
    });
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].permalink) {
        notifications[i].post = await databases.posts.findOne({
          attributes: ["id", "title", "status"],
          where: { permalink: notifications[i].permalink },
          include: [
            {
              model: databases.categories,
              through: {
                attributes: [],
              },
            },
          ],
        });
      }
    }
    // console.log(notifications);
    return res.status(200).json({
      success: true,
      data: notifications || [],
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

const getNewNotification = async (req, res) => {
  try {
    const notifications = await databases.notifications.findAll({
      where: {
        _user: req.user.id,
        isRead: false,
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  readNotifications,
  deleteNotifications,
  getAllNotification,
  getNewNotification,
};
