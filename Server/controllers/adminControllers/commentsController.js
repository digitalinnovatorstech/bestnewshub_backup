const databases = require("../../config/database/databases");

/*-------------------------------- Create Comment---------------------  */
const createComment = async (req, res) => {
  try {
    let { description, _post } = req.body;

    let post = await databases.posts.findByPk(_post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post or page not found",
      });
    }
    const userExist = await databases.users.findOne({
      where: { id: req.user.id },
      raw: true,
    });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const newComment = await databases.comments.create({
      description: description || null,
      _post: _post || null,
      _user: req.user.id,
    });
    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- get All Comments by post, page and user ------------------------*/
const getComments = async (req, res) => {
  try {
    let { postId, userId, status, perPage, currentPage } = req.query;
    const limit = parseInt(perPage) || 10;
    const offset = (currentPage - 1) * limit;
    const conditions = {
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

    if (postId) {
      conditions.where._post = postId;
      // conditions.include.push({});
    }
    if (userId) {
      conditions.where._user = userId;
    }
    if (status) {
      conditions.where.status = status.toUpperCase();
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
        currentPage: currentPage,
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

/*-------------------------------- get Comment by comment id ------------------------*/
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await databases.comments.findByPk(id, {
      include: [
        {
          model: databases.users,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email", "profilePhoto"],
        },
        {
          model: databases.posts,
          as: "post",
          attributes: ["id", "metaTitle", "metaDescription"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- update comment ------------------------*/
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, postId, status } = req.body;
    const comment = await databases.comments.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update comment data
    await comment.update({
      description,
      _post: postId,
      status: status?.toUpperCase(),
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- update comment ------------------------*/
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await databases.comments.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    await comment.destroy();
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bulkActionOnComment = async (req, res) => {
  try {
    const { ids, status } = req.body;
    let { action } = req.query;
    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'action' and 'ids' are required.",
      });
    }

    let affectedRows = 0;
    if (action.toUpperCase() === "DELETE") {
      affectedRows = await databases.comments.destroy({
        where: {
          id: ids,
        },
      });
      return res.status(200).json({
        success: true,
        message: `Deleted ${affectedRows} record(s) successfully.`,
      });
    }

    if (action.toUpperCase() === "STATUSCHANGE") {
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "'status' is required for changing status.",
        });
      }
      affectedRows = await databases.comments.update(
        { status },
        {
          where: {
            id: ids,
          },
        }
      );
      const statusMessages = {
        PENDING: "Pending",
        APPROVED: "Approved successfully",
        REJECTED: "Rejected successfully",
        SPAM: "Marked Spam",
        FLAGGED: "Makerd Flag",
      };
      return res.status(200).json({
        success: true,
        // message: `Updated status for ${affectedRows[0]} record(s) successfully.`,
        message: `${affectedRows[0]} records ${
          statusMessages[status?.toUpperCase()] || ""
        }.`,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid action. Use 'DELETE' or 'CHANGE_STATUS'.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  bulkActionOnComment,
};
