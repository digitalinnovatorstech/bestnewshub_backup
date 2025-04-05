const { Op } = require("sequelize");
const databases = require("../../config/database/databases");

/*-------------------------- get All Posts -----------------------------*/
const getMetaInfo = async (req, res) => {
  try {
    let metaInfo = await databases.generalSetting.findAll({
      attributes: ["id", "metaTitle", "metaDescription", "metaTags"],
      include: [
        {
          model: databases.users,
          as: "user",
          attributes: ["id", "userType"],
          where: {
            userType: "ADMIN",
          },
        },
      ],
    });
    return res.status(200).json({
      status: true,
      data: metaInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
const getHeroSection = async (req, res) => {
  try {
    let queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        {
          model: databases.categories,
          through: { attributes: [] },
        },
        {
          model: databases.comments,
          as: "comments",
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
      ],
      limit: 20,
      order: [["publishedAt", "DESC"]],
      where: {
        status: "PUBLISHED",
      },
    };

    let posts = await databases.posts.findAll(queryOptions);
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHomePagePosts = async (req, res) => {
  try {
    let { positionQuery, limit, category } = req.query;
    let queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
      ],
      limit: limit ? parseInt(limit, 10) : 4,
      order: [["publishedAt", "DESC"]],
      where: {
        homeLayout: positionQuery?.toUpperCase(),
        status: "PUBLISHED",
      },
    };
    let excludePosts = await databases.posts.findAll({
      limit: 20,
      order: [["publishedAt", "DESC"]],
      attributes: ["id"],
    });

    if (excludePosts && excludePosts.length > 0) {
      let excludePostIds = excludePosts.map((post) => post.id);
      queryOptions.where = {
        [Op.and]: [
          queryOptions.where,
          {
            id: {
              [Op.notIn]: excludePostIds,
            },
          },
        ],
      };
    }

    if ("EASY_SEARCH" === positionQuery.toUpperCase()) {
      if (category.toUpperCase() != "ALL") {
        let categoryRecord = await databases.categories.findOne({
          where: { name: { [Op.like]: `%${category}%` } },
        });
        if (categoryRecord) {
          const categoryId = categoryRecord.id;
          if (!queryOptions.include[1]) {
            queryOptions.include[1] = {};
          }
          queryOptions.include[1].where = { id: categoryId };
        }
      }
    }
    let posts = await databases.posts.findAll(queryOptions);
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHomePosts = async (req, res) => {
  try {
    let { limit } = req.query;
    limit = limit ? parseInt(limit, 10) : 10;
    let queryOptions = {
      attributes: [
        "id",
        "metaTitle",
        "metaDescription",
        "publishedAt",
        "SEOImageUrl",
        "verticalImageUrl",
        "squareImageUrl",
        "permalink",
        "metaTags",
      ],
      include: [
        {
          model: databases.categories,
          through: { attributes: [] },
        },
        {
          model: databases.comments,
          as: "comments",
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
      ],
      limit,
      offset: 0,
      order: [["publishedAt", "DESC"]],
      where: { status: "PUBLISHED" },
    };

    // Ensure that queryOptions.include[0] exists before modifying
    if (queryOptions.include[0]?.model === databases.categories) {
      queryOptions.include[0].where = { id: req.params.id };
    }
    let excludePosts = await databases.posts.findAll({
      limit: 20,
      order: [["publishedAt", "DESC"]],
      attributes: ["id"],
    });
    if (excludePosts && excludePosts.length > 0) {
      let excludePostIds = excludePosts.map((post) => post.id);
      queryOptions.where = {
        [Op.and]: [
          queryOptions.where,
          {
            id: {
              [Op.notIn]: excludePostIds,
            },
          },
        ],
      };
    }
    let posts = await databases.posts.findAll(queryOptions);

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMorePosts = async (req, res) => {
  try {
    let { limit, category } = req.query;
    let queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
      ],
      limit: limit ? parseInt(limit, 10) : 6,
      order: [["publishedAt", "DESC"]],
      where: {
        status: "PUBLISHED",
      },
    };

    let excludePosts = await databases.posts.findAll({
      limit: 20,
      order: [["publishedAt", "DESC"]],
      attributes: ["id"],
      where: {
        status: "PUBLISHED",
      },
    });

    let excludePostIds = [];
    if (excludePosts && excludePosts.length > 0) {
      excludePostIds.push(...excludePosts.map((post) => post.id));
    }
    if (category) {
      if (category.toUpperCase() != "ALL") {
        if (!queryOptions.include[1]) {
          queryOptions.include[1] = {};
        }
        queryOptions.include[1].where = { id: category };
      }
    }
    let posts = await databases.posts.findAll({
      where: {
        homeLayout: {
          [Op.or]: ["INTERNATIONAL", "NATIONAL", "SORTNEWS", "FEATUREDNEWS"],
        },
      },
    });

    if (posts && posts.length > 0) {
      excludePostIds.push(...posts.map((post) => post.id));
    }

    if (excludePostIds.length > 0) {
      queryOptions.where = {
        id: {
          [Op.notIn]: excludePostIds,
        },
        status: "PUBLISHED",
      };
    }

    let morePosts = await databases.posts.findAll(queryOptions);
    return res.status(200).json({
      success: true,
      data: morePosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    let { positionQuery, page } = req.query;
    let latest = 10;
    // let short = 5;
    let highlights = 8;
    let exploreMore = 6;
    let morePageSize = 8;
    let queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
      ],
      // attributes: { exclude: ["content"] },
      limit: latest,
      offset: 0,
      order: [["publishedAt", "DESC"]],
      where: {
        status: "PUBLISHED",
      },
    };

    if (!queryOptions.include[1]) {
      queryOptions.include[1] = {};
    }
    queryOptions.include[1].where = { id: req.params.id };
    if (positionQuery?.toUpperCase() === "HIGHLIGHTS") {
      queryOptions.limit = highlights;
      queryOptions.offset = latest;
    }

    if (positionQuery?.toUpperCase() === "EXPLOREMORE") {
      queryOptions.limit = exploreMore;
      queryOptions.offset = latest + highlights;
    }
    let totalPosts;
    if (positionQuery?.toUpperCase() === "MORE") {
      let excludeCount = latest + highlights + exploreMore;
      queryOptions.limit = page * morePageSize;
      queryOptions.offset = excludeCount;

      totalPosts = await databases.posts.count({
        include: {
          model: databases.categories,
          through: { attributes: [] },
          where: { id: req.params.id },
        },
        offset: 24,
      });
      totalPosts = totalPosts - 24;
    }
    let posts = await databases.posts.findAll(queryOptions);

    return res.status(200).json({
      success: true,
      totalPosts: totalPosts,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get Post By Id -----------------------------*/
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required.",
      });
    }

    const queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          where: { status: "APPROVED" },
          required: false,
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
        { model: databases.faq, as: "FAQ" },
        // {
        //   model: databases.savedPosts,
        //   as: "savedPosts",
        //   where: {
        //     _user: req?.user?.id,
        //   },
        // },
      ],
      where: { id: id },
    };

    let savedPost;
    if (req?.user?.id) {
      savedPost = await databases.savedPosts.findOne({
        where: {
          _user: req.user.id,
          _post: id,
        },
      });
    }

    let post = await databases.posts.findOne(queryOptions);
    return res.status(200).json({
      success: true,
      data: { post, isSaved: savedPost ? true : false },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- Update Post by ID -----------------------------*/
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
      tagIds,
      categoryIds,
    } = req.body;

    let post = await databases.posts.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (req.files) {
      SEOImageUrl = req.files.SEOImageUrl[0].location;
    }
    await post.update({
      title,
      description,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink: permalink.replace(/[%$&: ]/g, "-"),
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await databases.tags.findAll({ where: { id: tagIds } });
      await post.setTags(tags);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await databases.categories.findAll({
        where: { id: categoryIds },
      });
      await post.setCategories(categories);
    }

    post = await databases.posts.findByPk(id, {
      include: [databases.tags, databases.categories],
      // raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------------UpdateTag by ID-----------------------------*/
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await databases.posts.findByPk(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    await post.destroy();
    res.status(200).json({
      success: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createSavedPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;
    const post = await databases.posts.findByPk(postId);
    const isPostExist = await databases.savedPosts.findOne({
      where: {
        _post: postId,
        _user: userId,
      },
    });
    if (isPostExist) {
      return res.status(400).json({
        success: false,
        message: "Post already saved",
      });
    }
    if (!post) {
      return res.status(404).json({ message: "User or Post not found." });
    }
    const savedPost = await databases.savedPosts.create({
      _user: userId,
      _post: postId,
    });

    if (savedPost) {
      return res.status(201).json({
        success: true,
        message: "Post saved successfully.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Failed to save post.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSavedPostsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedPosts = await databases.savedPosts.findAll({
      where: { _user: userId },
      include: [{ model: databases.posts, as: "post" }],
    });

    if (savedPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No saved posts found for this user.",
      });
    }
    return res.status(200).json({
      success: true,
      data: savedPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSavedPost = async (req, res) => {
  try {
    const { id } = req.params;

    const savedPost = await databases.savedPosts.findOne({
      where: {
        _user: req.user.id,
        _post: id,
      },
    });

    if (!savedPost) {
      return res.status(404).json({
        success: false,
        message: "Saved post not found.",
      });
    }

    await savedPost.destroy();
    return res.status(200).json({
      success: true,
      message: "Saved post successfully deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSearchPosts = async (req, res) => {
  try {
    let { searchQuery, perPage, currentPage } = req.query;

    perPage = perPage ? parseInt(perPage) : 10;
    currentPage = currentPage ? parseInt(currentPage) : 1;
    const limit = perPage;
    const offset = (currentPage - 1) * limit;

    searchQuery = searchQuery ? searchQuery.trim().toLowerCase() : "";

    const totalSearchedPosts = await databases.posts.count({
      where: {
        status: "PUBLISHED",
        [Op.or]: [
          { metaDescription: { [Op.like]: `%${searchQuery}%` } },
          { metaTitle: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
    });

    const posts = await databases.posts.findAll({
      order: [["publishedAt", "DESC"]],
      attributes: [
        "id",
        "metaTitle",
        "metaDescription",
        "publishedAt",
        "SEOImageUrl",
        "verticalImageUrl",
        "squareImageUrl",
        "permalink",
      ],
      where: {
        status: "PUBLISHED",
        [Op.or]: [
          { metaDescription: { [Op.like]: `%${searchQuery}%` } },
          { metaTitle: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      include: [
        { model: databases.tags, through: { attributes: [] } },
        {
          model: databases.categories,
          through: { attributes: [] },
        },
        { model: databases.categories, through: { attributes: [] } },
      ],
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalSearchedPosts / limit);

    return res.status(200).json({
      success: true,
      posts: posts || [],
      pagination: {
        totalPosts: totalSearchedPosts,
        totalPages: totalPages,
        currentPage: currentPage,
        perPage: perPage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostByPermalink = async (req, res) => {
  try {
    const { permalink, userId } = req.query;
    if (!permalink) {
      return res.status(400).json({
        success: false,
        message: "Permalink is required is required.",
      });
    }
    const queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          where: {
            status: {
              [Op.notIn]: ["REJECTED", "SPAM", "FLAGGED"],
            },
          },
          required: false,
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
        { model: databases.faq, as: "FAQ" },
      ],
      where: {
        permalink: permalink,
        status: "PUBLISHED",
      },
    };
    let post = await databases.posts.findOne(queryOptions);
    let savedPost;
    if (req?.user?.id || userId) {
      savedPost = await databases.savedPosts.findOne({
        where: {
          _user: req?.user?.id || userId,
          _post: post?.dataValues?.id,
        },
      });
    }
    return res.status(200).json({
      success: true,
      data: { post, isSaved: savedPost ? true : false },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPostSEOInfo = async (req, res) => {
  try {
    const { permalink, userId } = req.query;
    if (!permalink) {
      return res.status(400).json({
        success: false,
        message: "Permalink is required is required.",
      });
    }
    const queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
        {
          model: databases.comments,
          as: "comments",
          where: {
            status: {
              [Op.notIn]: ["REJECTED", "SPAM", "FLAGGED"],
            },
          },
          required: false,
          include: [
            {
              model: databases.users,
              as: "creator",
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profilePhoto",
              ],
            },
          ],
        },
        { model: databases.faq, as: "FAQ" },
      ],
      where: {
        permalink: permalink,
        status: "PUBLISHED",
      },
    };
    let post = await databases.posts.findOne(queryOptions);
    let savedPost;
    if (req?.user?.id || userId) {
      savedPost = await databases.savedPosts.findOne({
        where: {
          _user: req?.user?.id || userId,
          _post: post?.dataValues?.id,
        },
      });
    }
    return res.status(200).json({
      success: true,
      data: { post, isSaved: savedPost ? true : false },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLogo = async (req, res) => {
  try {
    const icon = await databases.generalSetting.findOne({
      where: { _user: 1 },
      attributes: ["siteLogo"],
    });
    if (icon && icon.siteLogo) {
      return res.status(200).json({
        success: true,
        data: icon.siteLogo,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getPosts = async (req, res) => {
  try {
    let posts = await databases.posts.findAll({
      attributes: ["id", "permalink", "updatedAt"],
      order: [["publishedAt", "DESC"]],
      where: {
        status: "PUBLISHED",
      },
    });
    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getPostsByTag = async (req, res) => {
  try {
    let { tag, perPage, currentPage } = req.query;

    perPage = perPage ? parseInt(perPage) : 10;
    currentPage = currentPage ? parseInt(currentPage) : 1;
    const limit = perPage;
    const offset = (currentPage - 1) * limit;

    tag = tag?.toLowerCase();

    const totalSearchedPosts = await databases.posts.count({
      where: {
        status: "PUBLISHED",
        [Op.or]: [{ metaTags: { [Op.like]: `%${tag}%` } }],
      },
    });

    const posts = await databases.posts.findAll({
      order: [["publishedAt", "DESC"]],
      attributes: [
        "id",
        "metaTitle",
        "metaDescription",
        "publishedAt",
        "SEOImageUrl",
        "verticalImageUrl",
        "squareImageUrl",
        "permalink",
        "metaTags",
      ],
      where: {
        status: "PUBLISHED",
        [Op.or]: [{ metaTags: { [Op.like]: `%${tag}%` } }],
      },
      include: [
        { model: databases.tags, through: { attributes: [] } },
        {
          model: databases.categories,
          through: { attributes: [] },
        },
        { model: databases.categories, through: { attributes: [] } },
      ],
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalSearchedPosts / limit);

    return res.status(200).json({
      success: true,
      posts: posts || [],
      pagination: {
        totalPosts: totalSearchedPosts,
        totalPages: totalPages,
        currentPage: currentPage,
        perPage: perPage,
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
  getHeroSection,
  getHomePagePosts,
  getMorePosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByCategory,
  createSavedPost,
  getSavedPostsByUser,
  deleteSavedPost,
  getSearchPosts,
  getPostByPermalink,
  getMetaInfo,
  getLogo,
  getPostSEOInfo,
  getPosts,
  getPostsByTag,
  getHomePosts,
};
