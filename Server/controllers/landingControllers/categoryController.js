const { Op, fn, col, where } = require("sequelize");
const databases = require("../../config/database/databases");

/* --------------- Get all categories for hierarchy --------------- */
const getAllCategories = async (req, res) => {
  let status = req.query.status;
  try {
    const whereClause = status
      ? {
          where: {
            status: status.toUpperCase(),
            _parentCategories: null,
          },
          raw: true,
        }
      : {
          where: {
            _parentCategories: null,
          },
          raw: true,
        };

    const categories = await databases.categories.findAll(whereClause);

    const findParentCategories = async (category) => {
      if (!category._parentCategories) {
        return null;
      }
      const parentCategory = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: category._parentCategories },
        raw: true,
      });

      if (parentCategory) {
        parentCategory.parent = await findParentCategories(parentCategory);
        return parentCategory;
      }

      return null;
    };

    const findChildCategories = async (categoryId) => {
      const childCategories = await databases.categories.findAll({
        where: { _parentCategories: categoryId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });

      const processedChildren = await Promise.all(
        childCategories.map(async (child) => ({
          ...child,
          children: await findChildCategories(child.id),
        }))
      );

      return processedChildren;
    };
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const parent = await findParentCategories(category);
        const children = await findChildCategories(category.id);
        return {
          ...category,
          parent,
          children,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: processedCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

const getAllCategoriesForHeader = async (req, res) => {
  try {
    const whereClause = {
      _parentCategories: null,
    };
    const allCategories = await databases.categories.findAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    const childCategories = await databases.categories.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    const categoryMap = {};
    childCategories.forEach((category) => {
      category.children = [];
      categoryMap[category.id] = category;
    });

    childCategories.forEach((category) => {
      if (category._parentCategories) {
        if (categoryMap[category._parentCategories]) {
          categoryMap[category._parentCategories].children.push(category);
        }
      }
    });
    const processedCategories = allCategories.map((category) => ({
      ...category,
      children: categoryMap[category.id]?.children || [],
    }));

    return res.status(200).json({
      success: true,
      data: processedCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------Get a single category by ID-----------*/
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryInfo = await databases.categories.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      raw: true,
    });

    if (!categoryInfo) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const findParentCategories = async (category) => {
      if (!category._parentCategories) {
        return null;
      }
      const parentCategory = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: category._parentCategories },
        raw: true,
      });
      if (parentCategory) {
        parentCategory.parent = await findParentCategories(parentCategory);
        return parentCategory;
      }
      return null;
    };

    const findChildCategories = async (categoryId) => {
      const childCategories = await databases.categories.findAll({
        where: { _parentCategories: categoryId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      const processedChildren = await Promise.all(
        childCategories.map(async (child) => ({
          ...child,
          children: await findChildCategories(child.id),
        }))
      );
      return processedChildren;
    };
    const parent = await findParentCategories(categoryInfo);
    const children = await findChildCategories(categoryInfo.id);
    const categoryStructure = {
      ...categoryInfo,
      parent,
      children,
    };
    return res.status(200).json({
      success: true,
      data: categoryStructure,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const getCategoryBySlug = async (req, res) => {
//   try {
//     const { permalink } = req.query;
//     const categoryInfo = await databases.categories.findOne({
//       attributes: { exclude: ["createdAt", "updatedAt"] },
//       where: { slug: permalink },
//       // raw: true,
//     });

//     if (!categoryInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     const findParentCategories = async (category) => {
//       if (!category._parentCategories) {
//         return null;
//       }
//       const parentCategory = await databases.categories.findOne({
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         where: { id: category._parentCategories },
//         raw: true,
//       });
//       if (parentCategory) {
//         parentCategory.parent = await findParentCategories(parentCategory);
//         return parentCategory;
//       }
//       return null;
//     };

//     const findChildCategories = async (categoryId) => {
//       const childCategories = await databases.categories.findAll({
//         where: { _parentCategories: categoryId },
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         raw: true,
//       });
//       const processedChildren = await Promise.all(
//         childCategories.map(async (child) => ({
//           ...child,
//           children: await findChildCategories(child.id),
//         }))
//       );
//       return processedChildren;
//     };
//     const parent = await findParentCategories(categoryInfo);
//     const children = await findChildCategories(categoryInfo.id);
//     const categoryStructure = {
//       ...categoryInfo,
//       parent,
//       children,
//     };
//     return res.status(200).json({
//       success: true,
//       data: categoryStructure,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getCategoryBySlug = async (req, res) => {
  try {
    const { permalink } = req.query;

    // Fetch category info based on slug
    const categoryInfo = await databases.categories.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { slug: permalink },
      raw: true,
    });

    if (!categoryInfo) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Function to recursively find parent categories
    const findParentCategories = async (categoryId) => {
      if (!categoryId) return null;
      const parentCategory = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: categoryId },
        raw: true,
      });

      if (parentCategory) {
        parentCategory.parent = await findParentCategories(
          parentCategory._parentCategories
        );
        return parentCategory;
      }
      return null;
    };

    // Function to recursively find child categories
    const findChildCategories = async (categoryId) => {
      const childCategories = await databases.categories.findAll({
        where: { _parentCategories: categoryId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });

      return Promise.all(
        childCategories.map(async (child) => ({
          ...child,
          children: await findChildCategories(child.id),
        }))
      );
    };

    // Fetch parent and child categories
    const parent = await findParentCategories(categoryInfo._parentCategories);
    const children = await findChildCategories(categoryInfo.id);

    // Construct category structure
    const categoryStructure = {
      ...categoryInfo,
      parent,
      children,
    };

    return res.status(200).json({
      success: true,
      data: categoryStructure,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    let slug = req.query?.slug?.toUpperCase();
    let categoryInfo = await databases.categories.findOne({
      attributes: ["id", "name", "metaTitle", "metaDescription", "metaTags"],
      where: { slug: slug },
    });
    if (!categoryInfo) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: categoryInfo || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
/* --------------- Get all Popular Category categories for --------------- */
const getPopularCategoriesList = async (req, res) => {
  try {
    const categories = await databases.categories.findAll({
      attributes: [
        "id",
        "name",
        "slug",
        [fn("COUNT", col("Posts.id")), "postCount"],
      ],
      include: [
        {
          model: databases.posts,
          through: {
            attributes: [],
          },
          required: false,
        },
      ],
      group: ["Categories.id"],
      order: [[fn("COUNT", col("Posts.id")), "DESC"]],
    });

    const result = categories.slice(0, 10).map((category) => ({
      categoryId: category.id,
      name: category.name,
      postCount: category.dataValues.postCount,
      slug: category.slug,
    }));

    const totalPosts = result.reduce(
      (acc, category) => acc + category.postCount,
      0
    );

    return res.status(200).json({
      success: true,
      data: { categories: result, totalPosts },
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await databases.categories.findAll({
      attributes: ["id", "slug", "updatedAt"],
      where: {
        status: "PUBLISHED",
      },
    });
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHomePageCategory = async (req, res) => {
  try {
    let categoryInfo = await databases.categories.findAll({
      order: [["index", "ASC"]],
      attributes: [
        "id",
        "name",
        "metaTitle",
        "metaDescription",
        "metaTags",
        "slug",
        "index",
      ],
      where: {
        isHome: true,
      },
    });
    if (!categoryInfo) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: categoryInfo || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCategoriesForHeader,
  getAllCategories,
  getCategoryById,
  getCategory,
  getPopularCategoriesList,
  getCategoryBySlug,
  getCategories,
  getHomePageCategory,
  // changeCategoryIndex,
};
