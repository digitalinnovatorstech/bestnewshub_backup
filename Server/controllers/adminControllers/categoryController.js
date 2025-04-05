const { Op, fn, col, where, Sequelize } = require("sequelize");
const databases = require("../../config/database/databases");

/*-------------- Create a new category----------*/
const createCategory = async (req, res) => {
  try {
    let inputData = req.body;

    if (inputData._parentCategories) {
      let parentCategory = await databases.categories.findOne({
        where: { id: inputData._parentCategories },
        raw: true,
      });
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    let slugRecord = await databases.categories.findByPk(
      inputData._parentCategories
    );
    let slug;
    // if (slugRecord && slugRecord.slug) {
    //   slug = slugRecord.slug;
    //   slug = `${slug.replace(/\/\d+$/, "")}/${inputData.name?.toUpperCase()}`;
    // } else {
    //   slug = `${inputData.name?.toUpperCase()}`;
    // }

    if (slugRecord && slugRecord.slug) {
      slug = slugRecord.slug;
      slug = `${slug.replace(/\/\d+$/, "")}/${formatSlug(inputData.name)}`;
    } else {
      slug = `${formatSlug(inputData.name)}`;
    }
    function formatSlug(text) {
      return text
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    let isSlugExist = await databases.categories.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { slug: slug?.toUpperCase() },
    });
    if (isSlugExist) {
      return res.status(400).json({
        success: false,
        message: "Category slug already exist",
      });
    }
    const category = await databases.categories.create({
      name: inputData.name?.replace(/ /g, ""),
      status: inputData.status?.toUpperCase(),
      metaTitle: inputData.metaTitle,
      metaDescription: inputData.metaDescription,
      metaKeywords: inputData.metaKeywords?.join(","),
      metaTags: inputData.metaTags?.join(","),
      _parentCategories: inputData._parentCategories,
      slug: slug?.toUpperCase(),
    });

    return res.status(200).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/* --------------- Get all categories ----------*/
const getAllCategoriesList = async (req, res) => {
  let status = req.query.status;
  try {
    let whereClause = { raw: true };
    if (status) {
      whereClause.where = { status: status.toUpperCase() };
    }
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

    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const parent = await findParentCategories(category);
        return {
          ...category,
          parent,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

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

/*--------------------Update a category by ID-----------*/
const updateCategory = async (req, res) => {
  try {
    let inputData = req.body;
    inputData.name = inputData?.name?.replace(/ /g, "");
    const category = await databases.categories.findByPk(req.params.id);
    if (category) {
      let slug;
      if (inputData._parentCategories) {
        let slugRecord = await databases.categories.findByPk(
          inputData._parentCategories
        );
        if (slugRecord && slugRecord.slug) {
          slug = slugRecord.slug;
          slug = `${slug.replace(/\/\d+$/, "")}/${formatSlug(inputData.name)}`;
        }
      } else {
        slug = `${formatSlug(inputData.name)}`;
      }
      function formatSlug(text) {
        return text
          ?.toUpperCase()
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      }

      let isSlugExist = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { slug: slug?.toUpperCase() },
        // raw: true,
      });
      if (isSlugExist) {
        return res.status(400).json({
          success: false,
          message: "Category slug already exist",
        });
      } else {
        inputData.slug = slug?.toUpperCase();
      }
      if (inputData.metaTags?.length > 0) {
        inputData.metaTags = inputData.metaTags.join(",");
      }
      await category.update(inputData);

      return res.status(200).json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------Delete a category by ID-----------*/
const deleteCategory = async (req, res) => {
  try {
    const category = await databases.categories.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* --------------- Get all Popular Category categories for --------------- */
const getPopularCategoriesList = async (req, res) => {
  try {
    const categories = await databases.categories.findAll({
      attributes: ["id", "name", [fn("COUNT", col("Posts.id")), "postCount"]],
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

const getCategoryByUser = async (req, res) => {
  let status = req.query.status;
  try {
    let whereClause = { raw: true };

    if (status) {
      whereClause.where = { status: status.toUpperCase() };
    }

    const categories = await databases.categories.findAll({
      ...whereClause,
      include: [
        {
          model: databases.userCategory,
          as: "userCategory",
          attributes: ["id", "_user", "_category"],
          where: { _user: req.user.id },
          include: [
            {
              model: databases.users,
              as: "user",
              attributes: ["id", "username", "email"],
            },
            {
              model: databases.categories,
              as: "categories",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
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
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const parent = await findParentCategories(category);
        return {
          ...category,
          parent,
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

// const addCategoryToHome = async (req, res) => {
//   try {
//     const { categoryId } = req.body;
//     const category = await databases.categories.findByPk(categoryId);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     const lastCategory = await databases.categories.findOne({
//       where: { isHome: true },
//       order: [["index", "DESC"]],
//     });

//     const newIndex = lastCategory ? lastCategory.index + 1 : 0;
//     await category.update({ isHome: true, index: newIndex });

//     res.status(200).json({
//       success: true,
//       message: "Category added to home successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// const deleteCategoryFromHome = async (req, res) => {
//   try {
//     const { categoryId } = req.body;
//     const category = await databases.categories.findByPk(categoryId);

//     if (!category || !category.isHome) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found or not in home",
//       });
//     }

//     await category.update({ isHome: false, index: null });

//     const categories = await databases.categories.findAll({
//       where: { isHome: true },
//       order: [["index", "ASC"]],
//     });

//     const updatePromises = categories.map((category, index) =>
//       category.update({ index })
//     );
//     await Promise.all(updatePromises);

//     res.status(200).json({
//       success: true,
//       message: "Category removed from home successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const addCategoryToHome = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await databases.categories.findByPk(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (category.isHome) {
      return res
        .status(400)
        .json({ success: false, message: "Category is already in home" });
    }

    const homeCategoriesCount = await databases.categories.count({
      where: { isHome: true },
    });
    await category.update({ isHome: true, index: homeCategoriesCount });

    return res
      .status(200)
      .json({ success: true, message: "Category added to home successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteCategoryFromHome = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await databases.categories.findByPk(categoryId);
    if (!category || !category.isHome) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found or not in home" });
    }
    let index = category?.index;
    await category.update({ isHome: false, index: null });
    await databases.categories.update(
      { index: Sequelize.literal("`index` - 1") },
      {
        where: {
          isHome: true,
          index: { [Op.gt]: index },
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Category removed from home successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const changeCategoryIndex = async (req, res) => {
  try {
    const { categoryId, sourceIndex, destinationIndex } = req.body;
    const categories = await databases.categories.findAll({
      where: { isHome: true },
      order: [["index", "ASC"]],
    });

    const movedCategory = categories.find((cat) => cat.id === categoryId);
    if (!movedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    categories.splice(sourceIndex, 1);
    categories.splice(destinationIndex, 0, movedCategory);
    const updatePromises = categories.map((category, index) =>
      category.update({ index })
    );
    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Category moved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  createCategory,
  getAllCategoriesList,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getPopularCategoriesList,
  getCategoryByUser,
  changeCategoryIndex,
  addCategoryToHome,
  deleteCategoryFromHome,
};
