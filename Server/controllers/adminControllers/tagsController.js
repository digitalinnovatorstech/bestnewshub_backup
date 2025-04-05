const { Op, col, fn } = require("sequelize");
const databases = require("../../config/database/databases");

/*--------------------create tag-----------*/
const createTag = async (req, res) => {
  try {
    const inputData = req.body;

    let isTagsExist = await databases.tags.findOne({
      where: { name: inputData.name?.toLowerCase() },
    });
    let tags;
    if (!isTagsExist) {
      tags = await databases.tags.create(inputData);
    }
    return res.status(201).json({
      success: true,
      data: tags || null,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------get all tags by status and categories-----------*/
const getAllTags = async (req, res) => {
  try {
    let { perPage, currentPage, status, _categories, searchQuery } = req.query;
    currentPage = parseInt(currentPage);
    const limit = parseInt(perPage);
    const offset = (currentPage - 1) * limit;
    let whereClause = {
      include: [
        {
          model: databases.posts,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
      limit: limit,
      offset: offset,
    };
    if (status) {
      whereClause.where = { status: status };
    }
    if (_categories) {
      whereClause.where = { _categories: _categories };
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const searchTerms = searchQuery.trim().split(" ");

      if (!whereClause.where) {
        whereClause.where = {};
      }

      if (searchTerms.length > 1) {
        whereClause.where[Op.and] = [
          { name: { [Op.like]: `%${searchTerms[0]}%` } },
        ];
      } else {
        whereClause.where[Op.or] = [
          { name: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
    }
    let countConditions = {
      where: whereClause.where,
    };
    let totalTags = await databases.tags.count(countConditions);
    let tags = await databases.tags.findAll(whereClause);
    const totalPages = Math.ceil(totalTags / limit);
    tags = tags.map((tag) => ({
      ...tag.toJSON(),
      totalPost: tag.posts?.length,
    }));

    return res.status(200).json({
      success: true,
      data: { tags } || [],
      pagination: {
        totalItems: totalTags,
        totalPages,
        currentPage: currentPage,
        perPage: limit,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------Tags List-----------*/
const getTagsList = async (req, res) => {
  try {
    let { _categories, searchQuery } = req.query;

    let whereClause = {
      include: [
        {
          model: databases.posts,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    };

    if (_categories) {
      whereClause.where = { _categories: _categories };
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const searchTerms = searchQuery.trim().split(" ");

      if (!whereClause.where) {
        whereClause.where = {};
      }

      if (searchTerms.length > 1) {
        whereClause.where[Op.and] = [
          { name: { [Op.like]: `%${searchTerms[0]}%` } },
        ];
      } else {
        whereClause.where[Op.or] = [
          { name: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
    }

    let tags = await databases.tags.findAll(whereClause);
    tags = tags.map((tag) => ({
      ...tag.toJSON(),
      totalPost: tag.posts?.length,
    }));

    return res.status(200).json({
      success: true,
      data: { tags } || [],
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------Get a single Tag by ID-----------*/
const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    let tagData = await databases.tags.findOne({
      where: { id: id },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      data: tagData || null,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------remove a single Tag by ID-----------*/
const removeTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { ids } = req.body;
    if (id) {
      let tagData = await databases.tags.findOne({ where: { id: id } });
      if (!tagData) {
        return res.status(404).json({
          success: false,
          message: "Tag not found",
        });
      }
      await tagData.destroy();
      return res.status(200).json({
        success: true,
        message: "Tag removed successfully",
      });
    }
    if (Array.isArray(ids) && ids.length > 0) {
      let deletedCount = await databases.tags.destroy({ where: { id: ids } });
      if (deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No tags found to delete",
        });
      }
      return res.status(200).json({
        success: true,
        message: `${deletedCount} tags removed successfully`,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid request. Provide a valid ID or array of IDs.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------UpdateTag by ID-----------*/
const updateTags = async (req, res) => {
  try {
    const id = req.params.id;
    const inputData = req.body;
    let tagData = await databases.tags.findOne({
      where: { id: id },
    });
    if (!tagData) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
    await tagData.update(inputData);
    return res.status(200).json({
      success: true,
      message: "Tag updated",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagsList,
  getTagById,
  removeTags,
  updateTags,
};
