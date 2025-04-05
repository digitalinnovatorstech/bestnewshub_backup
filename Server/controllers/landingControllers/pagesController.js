const { where } = require("sequelize");
const databases = require("../../config/database/databases");
const { excelToJsonHandler } = require("../../utils/excelUtils");

/*-------------------------- get All Pages -----------------------------*/
const getPages = async (req, res) => {
  try {
    let { perPage, currentPage, searchQuery, status, thisMonth, latest } =
      req.query;
    currentPage = parseInt(currentPage) || 1;
    const limit = parseInt(perPage) || 10;
    const offset = (currentPage - 1) * limit;
    const queryOptions = {
      include: [
        {
          model: databases.users,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      attributes: [
        "id",
        "pageName",
        "title",
        "status",
        "metaTitle",
        "metaDescription",
        "permalink",
        "createdAt",
        "updatedAt",
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      where: {},
    };
    if (status) {
      queryOptions.where = {
        [Op.and]: [queryOptions.where, { status: status.toUpperCase() }],
      };
    }
    if (searchQuery) {
      queryOptions.where = {
        [Op.and]: [
          queryOptions.where,
          {
            title: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      };
    }

    let pages = await databases.pages.findAndCountAll({
      ...queryOptions,
      distinct: true,
    });

    const totalPages = Math.ceil(pages.count / limit);
    if (pages) {
      return res.status(200).json({
        success: true,
        data: pages.rows,
        pagination: {
          totalItems: pages.count,
          totalPages,
          currentPage: currentPage,
          perPage: limit,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get Page by Id -----------------------------*/
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await databases.pages.findByPk(id, { raw: true });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    page.totalcomments = await databases.comments.count({
      where: { _post: page.id },
    });
    page.comments = await databases.comments.findAll({
      where: { _post: page.id },
    });
    page.faq = await databases.faq.findAll({
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      where: { _page: page.id },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPagesByPermalink = async (req, res) => {
  try {
    const { permalink } = req.query;
    const page = await databases.pages.findOne({
      where: { permalink },
      include: {
        model: databases.faq,
        as: "FAQ",
        attributes: { exclude: ["updatedAt"] },
      },
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    // page.totalcomments = await databases.comments.count({
    //   where: { _post: page.id }
    // });
    // page.comments = await databases.comments.findAll({
    //   where: { _post: page.id }
    // });
    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPagesSEOInfoByPermalink = async (req, res) => {
  try {
    const { permalink } = req.query;
    const page = await databases.pages.findOne({
      attributes: [
        "metaTitle",
        "metaDescription",
        "SEOImageUrl",
        "metaTags",
        "createdAt",
      ],
      where: { permalink },
    });
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPages = async (req, res) => {
  try {
    let pages = await databases.pages.findAll({
      attributes: ["id", "permalink", "updatedAt"],
      where: {
        status: "PUBLISHED",
      },
    });
    return res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPages,
  getPageById,
  getPagesByPermalink,
  getPagesSEOInfoByPermalink,
  getAllPages,
};
