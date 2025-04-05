const { Op } = require("sequelize");
const databases = require("../../config/database/databases");
const { excelToJsonHandler } = require("../../utils/excelUtils");

/*-------------------------- Create Page -----------------------------*/
const createPage = async (req, res) => {
  try {
    let {
      pageName,
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      metaTags,
      permalink,
      SEOImageUrl,
      faq,
    } = req.body;
    if (req.files?.faqFile && req.files.faqFile?.length > 0) {
      const faqFile = req.files?.faqFile[0]?.location;
      if (faqFile) {
        bulkFAQJson = await excelToJsonHandler(faqFile);
      }
    }
    if (req.files?.SEOImageUrl && req.files?.SEOImageUrl?.length > 0) {
      SEOImageUrl = req.files?.SEOImageUrl[0]?.location || null;
    }

    const createdPage = await databases.pages.create({
      pageName,
      title,
      content,
      status: status?.toUpperCase(),
      metaTitle,
      metaDescription,
      metaTags: metaTags,
      permalink,
      SEOImageUrl,
      _user: req.user.id,
    });

    let newPage = await databases.pages.findOne({
      where: { id: createdPage.id },
      raw: true,
    });

    let bulkFAQJson;
    if (faq && faq?.length > 0) bulkFAQJson = bulkFAQJson?.concat(faq);
    let faqs = [];
    if (bulkFAQJson) {
      for (let i = 0; i < bulkFAQJson.length; i++) {
        let faq = bulkFAQJson[i];
        let addedFAQ = await databases.faq.create({
          question: faq.question,
          answer: faq.answer,
          _page: newPage.id,
        });
        faqs.push(addedFAQ);
      }
    } else {
      faq = JSON.parse(faq);
      if (faq?.length > 0) {
        for (let i = 0; i < faq.length; i++) {
          let addedFAQ = await databases.faq.create({
            question: faq[i].question,
            answer: faq[i].answer,
            _page: newPage.id,
          });
          faqs.push(addedFAQ);
        }
      }
    }
    newPage.faqs = faqs;
    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
        "metaTags",
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

/*-------------------------- Update Page -----------------------------*/
const updatePage = async (req, res) => {
  try {
    let { id } = req.params;
    let {
      pageName,
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      metaTags,
      permalink,
      SEOImageUrl,
      faq,
    } = req.body;
    let bulkFAQJson;
    let page = await databases.pages.findByPk(id);
    if (req.files?.faqFile && req.files.faqFile?.length > 0) {
      const faqFile = req.files?.faqFile[0]?.location;
      if (faqFile) {
        bulkFAQJson = await excelToJsonHandler(faqFile);
      }
    }
    if (req.files?.SEOImageUrl && req.files?.SEOImageUrl?.length > 0) {
      SEOImageUrl = req.files?.SEOImageUrl[0]?.location || null;
    }

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    await databases.faq.destroy({
      where: { _page: id },
    });
    if (faq && faq?.length > 0) bulkFAQJson = bulkFAQJson?.concat(faq);
    let faqs = [];
    if (bulkFAQJson) {
      for (let i = 0; i < bulkFAQJson.length; i++) {
        let faq = bulkFAQJson[i];
        let addedFAQ = await databases.faq.create({
          question: faq.question,
          answer: faq.answer,
          _page: id,
        });
        faqs.push(addedFAQ);
      }
    } else {
      faq = JSON.parse(faq);
      if (faq?.length > 0) {
        for (let i = 0; i < faq.length; i++) {
          let addedFAQ = await databases.faq.create({
            question: faq[i].question,
            answer: faq[i].answer,
            _page: id,
          });
          faqs.push(addedFAQ);
        }
      }
    }
    page.faqs = faqs;
    let temp = await page.update({
      pageName,
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      metaTags,
      permalink,
      SEOImageUrl,
    });
    if (temp) {
      return res.status(200).json({
        success: true,
        message: "Page updated successfully",
        data: page,
      });
    }
    return res.status(400).json({
      success: false,
      message: "faild updat",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- delete Page -----------------------------*/
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await databases.pages.findByPk(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    await page.destroy();

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (ids?.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Empty ids",
      });
    }
    await databases.pages.destroy({
      where: {
        id: ids,
      },
    });

    return res.status(200).json({
      success: true,
      message: `${ids.length} ${
        ids.length > 1 ? "Pages" : "Page"
      } deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  bulkDelete,
};
