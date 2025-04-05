const { Op, where, json } = require("sequelize");
const databases = require("../../config/database/databases");
const moment = require("moment");
const { excelToJsonHandler } = require("../../utils/excelUtils");
const users = require("../../models/users");
const { sendMail } = require("../../utils/userMailer");
const {
  postNotificationEmailTemplate,
  adminPendingPostNotificationTemplate,
} = require("../../mailTemplates/authMail");

/*-------------------------- Create Post -----------------------------*/

const createPost = async (req, res) => {
  try {
    let {
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isIndex,
      categoryLayout,
      homeLayout,
      SEOImageUrl,
      verticalImageUrl,
      squareImageUrl,
      tagIds = [],
      categoryIds,
      faq,
      publishedAt,
      tempPermalink,
      showingCategies,
      metaTags,
    } = req.body;
    let bulkFAQJson;
    if (status?.toUpperCase() === "PUBLISHED") {
      if (!publishedAt) {
        publishedAt = new Date().toISOString();
      }
    }
    if (req?.files) {
      if (req.files.faqFile && req.files.faqFile?.length > 0) {
        const faqFile = req.files.faqFile[0]?.location;
        if (faqFile) {
          bulkFAQJson = await excelToJsonHandler(faqFile);
        }
      }
      if (req.files.SEOImageUrl && req.files.SEOImageUrl?.length > 0) {
        SEOImageUrl = req.files.SEOImageUrl[0]?.location || null;
      }
      if (req.files.verticalImageUrl && req.files.verticalImageUrl.length > 0) {
        verticalImageUrl = req.files.verticalImageUrl[0]?.location || null;
      }
      if (req.files.squareImageUrl && req.files.squareImageUrl.length > 0) {
        squareImageUrl = req.files.squareImageUrl[0]?.location || null;
      }
    }
    let user = await databases.users.findByPk(req.user?.id || 1);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist.",
      });
    }
    let permalinkExist = await databases.posts.findOne({
      where: { permalink: permalink },
    });
    if (permalinkExist) {
      return res.status(400).json({
        success: false,
        message: "Please enter unique permalink",
      });
    }
    const createdPost = await databases.posts.create({
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink: permalink
        ?.toLowerCase()
        .replace(/[%$&: ]/g, "-")
        .replace(/-$/, "")
        ?.toLowerCase()
        .replace(/[%$&: ]/g, "-")
        .replace(/-$/, ""),
      isIndex,
      categoryLayout: categoryLayout?.toUpperCase(),
      homeLayout: homeLayout?.toUpperCase(),
      SEOImageUrl,
      verticalImageUrl,
      squareImageUrl,
      publishedAt,
      _user: req.user?.id || 1,
      tempPermalink: tempPermalink?.replace(/-$/, ""),
      showingCategies,
      metaTags: metaTags,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await databases.tags.findAll({ where: { id: tagIds } });
      await createdPost.addTags(tags);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await databases.categories.findAll({
        where: { id: categoryIds },
      });
      await createdPost.addCategories(categories);
    }
    let newPost = await databases.posts.findOne({
      where: { id: createdPost.id },
      raw: true,
    });
    if (faq?.length > 0) {
      bulkFAQJson = bulkFAQJson?.concat(faq);
    }

    let faqs = [];
    if (bulkFAQJson) {
      for (let i = 0; i < bulkFAQJson.length; i++) {
        let faq = bulkFAQJson[i];
        let addedFAQ = await databases.faq.create({
          question: faq.question,
          answer: faq.answer,
          _post: newPost.id,
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
            _post: newPost.id,
          });
          faqs.push(addedFAQ);
        }
      }
    }
    newPost.faqs = faqs;
    if (user) {
      let blogPostCount = user.blogPostCount + 1;
      await user.update({ blogPostCount });
    }

    if (newPost.status != "PENDING") {
      let notifyUser = await databases.users.findAll({
        where: { userType: "SUBSCRIBER", status: "ACTIVE" },
        include: [
          {
            model: databases.generalSetting,
            as: "generalSetting",
            where: {
              notification: true,
              postNotification: true,
            },
          },
        ],
      });
      let notifyAdmin = await databases.users.findAll({
        where: { userType: "ADMIN", status: "ACTIVE" },
        include: [
          {
            model: databases.generalSetting,
            as: "generalSetting",
            where: {
              notification: true,
              postNotification: true,
            },
          },
        ],
      });

      let mailNotifyUser = await databases.users.findAll({
        where: { userType: "SUBSCRIBER", status: "ACTIVE" },
        include: [
          {
            model: databases.generalSetting,
            as: "generalSetting",
            where: {
              emailNotification: true,
              postNotification: true,
            },
          },
        ],
      });
      for (let i = 0; i < mailNotifyUser.length; i++) {
        let body = postNotificationEmailTemplate(
          `${mailNotifyUser.firstName} ${mailNotifyUser.lastName}`,
          newPost.metaTitle,
          newPost.permalink,
          "support@bestnewshub.com"
        );
        await sendMail(
          mailNotifyUser[i].email,
          "New Notification from Best News Hub",
          body
        );
      }
      for (let i = 0; i < notifyAdmin.length; i++) {
        await databases.notifications.create({
          _user: notifyAdmin[i].id,
          notificationsTitle: `New Post Published - By ${user.firstName} ${user.lastName}`,
          notificationContent: metaTitle,
          permalink: newPost.permalink,
        });
      }
      for (let i = 0; i < notifyUser.length; i++) {
        await databases.notifications.create({
          _user: notifyUser[i].id,
          notificationsTitle: "New Post Published",
          notificationContent: metaTitle,
          permalink: newPost.permalink,
        });
      }
    } else {
      let body = adminPendingPostNotificationTemplate(
        `${user.firstName} ${user.lastName}`,
        newPost.metaTitle,
        newPost.permalink,
        newPost.permalink
      );
      let adminMailNotifyUser = await databases.users.findAll({
        where: { userType: "ADMIN", status: "ACTIVE" },
        include: [
          {
            model: databases.generalSetting,
            as: "generalSetting",
            where: {
              emailNotification: true,
              postNotification: true,
            },
          },
        ],
      });
      for (let i = 0; i < adminMailNotifyUser.length; i++) {
        await databases.notifications.create({
          _user: adminMailNotifyUser[i].id,
          notificationsTitle:
            "Pending Post Review: New Submission by Guest Author",
          notificationContent: metaTitle,
          permalink: newPost.permalink,
        });
      }
      for (let i = 0; i < adminMailNotifyUser.length; i++) {
        await sendMail(
          adminMailNotifyUser[i].email,
          "New Notification from Best News Hub",
          body
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get All Posts -----------------------------*/
const getPosts = async (req, res) => {
  try {
    let {
      perPage,
      currentPage,
      searchQuery,
      tag,
      tagIds,
      category,
      categoryIds,
      status,
      thisMonth,
      latest,
    } = req.query;
    currentPage = parseInt(currentPage) || 1;
    const limit = parseInt(perPage) || 10;
    const offset = (currentPage - 1) * limit;
    const queryOptions = {
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
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
        {
          model: databases.users,
          as: "author",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      attributes: [
        "id",
        "title",
        "status",
        "metaTitle",
        "metaDescription",
        "permalink",
        "showingCategies",
        "tempPermalink",
        "metaTags",
        "showingCategies",
        "_user",
        "publishedAt",
        "SEOImageUrl",
        "createdAt",
        "updatedAt",
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      where: {},
    };

    if (req.user.userType?.toUpperCase() != "ADMIN") {
      queryOptions.where = {
        [Op.and]: [
          queryOptions.where,
          {
            _user: req.user.id,
          },
        ],
      };
    }
    if (latest) {
      queryOptions.order = [["createdAt", "DESC"]];
      queryOptions.limit = 5;
    }
    if (tagIds) {
      const tagsArray = Array.isArray(tagIds) ? tagIds : [tagIds];
      queryOptions.include[0].where = {
        id: tagsArray,
      };
    }
    if (tag) {
      let tagRecord = await databases.tags.findOne({
        where: { name: { [Op.like]: tag } },
      });
      if (tagRecord) {
        const tagId = tagRecord.id;
        queryOptions.include[0].where = {
          id: tagId,
        };
      }
    }
    if (categoryIds) {
      const categoriesArray = Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds];
      queryOptions.include[1].where = {
        id: categoriesArray,
      };
    }

    if (category) {
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

    if (status) {
      queryOptions.where = {
        [Op.and]: [queryOptions.where, { status: status.toUpperCase() }],
      };
    }

    if (thisMonth) {
      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();
      queryOptions.where = {
        [Op.and]: [
          queryOptions.where,
          {
            createdAt: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        ],
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

    let posts = await databases.posts.findAndCountAll({
      ...queryOptions,
      distinct: true,
    });

    const totalPages = Math.ceil(posts.count / limit);
    if (posts) {
      return res.status(200).json({
        success: true,
        data: posts.rows,
        pagination: {
          totalItems: posts.count,
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
          include: [{ model: databases.users, as: "creator" }],
        },
        {
          model: databases.faq,
          as: "FAQ",
        },
      ],
      where: {
        id: id,
      },
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

    if (post) {
      return res.status(200).json({
        success: true,
        data: { post, isSaved: savedPost ? true : false },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
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
      isIndex,
      categoryLayout,
      homeLayout,
      SEOImageUrl,
      verticalImageUrl,
      squareImageUrl,
      tagIds = [],
      categoryIds,
      publishedAt,
      tempPermalink,
      showingCategies,
      metaTags,
      faq,
    } = req.body;
    let bulkFAQJson;

    let post = await databases.posts.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (req?.files) {
      if (req.files.faqFile && req.files.faqFile.length > 0) {
        const faqFile = req.files.faqFile[0]?.location;
        if (faqFile) {
          bulkFAQJson = await excelToJsonHandler(faqFile);
        }
      }
      if (req.files.SEOImageUrl && req.files.SEOImageUrl.length > 0) {
        SEOImageUrl = req.files.SEOImageUrl[0]?.location || null;
      }
      if (req.files.verticalImageUrl && req.files.verticalImageUrl.length > 0) {
        verticalImageUrl = req.files.verticalImageUrl[0]?.location || null;
      }
      if (req.files.squareImageUrl && req.files.squareImageUrl.length > 0) {
        squareImageUrl = req.files.squareImageUrl[0]?.location || null;
      }
    }
    await databases.faq.destroy({
      where: { _post: id },
    });
    if (faq && faq?.length > 0) bulkFAQJson = bulkFAQJson?.concat(faq);
    let faqs = [];
    if (bulkFAQJson) {
      for (let i = 0; i < bulkFAQJson.length; i++) {
        let faq = bulkFAQJson[i];
        let addedFAQ = await databases.faq.create({
          question: faq.question,
          answer: faq.answer,
          _post: id,
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
            _post: id,
          });
          faqs.push(addedFAQ);
        }
      }
    }
    post.faqs = faqs;

    await post.update({
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink: permalink
        ?.toLowerCase()
        .replace(/[%$&: ]/g, "-")
        .replace(/-$/, ""),
      isIndex,
      publishedAt,
      categoryLayout: categoryLayout?.toUpperCase(),
      homeLayout: homeLayout?.toUpperCase(),
      SEOImageUrl,
      verticalImageUrl,
      squareImageUrl,
      tempPermalink: tempPermalink?.replace(/-$/, ""),
      showingCategies,
      metaTags: metaTags,
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

    // post = await databases.posts.findByPk(id, {
    //   include: [databases.tags, databases.categories]
    // });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const ids = req.params.id;
    // const { ids } = req.body;

    const post = await databases.posts.findAll({ where: { id: ids } });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    await databases.posts.destroy({
      where: { id: ids },
    });
    return res.status(200).json({
      success: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bulkAction = async (req, res) => {
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
      affectedRows = await databases.posts.destroy({
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
      if (status.toUpperCase() === "PUBLISHED") {
        affectedRows = await databases.posts.update(
          { status, publishedAt: new Date() },
          {
            where: {
              id: ids,
            },
          }
        );
      } else {
        affectedRows = await databases.posts.update(
          { status },
          {
            where: {
              id: ids,
            },
          }
        );
      }

      const statusMessages = {
        PUBLISHED: "Published successfully",
        DRAFT: "Saved as draft",
        PENDING: "Marked as pending",
        REJECTED: "Rejected",
      };
      if (status.toUpperCase() === "PUBLISHED") {
        for (let i = 0; i < ids.length; i++) {
          let postInfo = await databases.posts.findOne({
            where: { id: ids[i] },
          });
          let notifyUser = await databases.users.findAll({
            where: { userType: "SUBSCRIBER", status: "ACTIVE" },
            include: [
              {
                model: databases.generalSetting,
                as: "generalSetting",
                where: {
                  notification: true,
                  postNotification: true,
                },
              },
            ],
          });

          let mailNotifyUser = await databases.users.findAll({
            where: { userType: "SUBSCRIBER", status: "ACTIVE" },
            include: [
              {
                model: databases.generalSetting,
                as: "generalSetting",
                where: {
                  emailNotification: true,
                  postNotification: true,
                },
              },
            ],
          });
          for (let i = 0; i < mailNotifyUser.length; i++) {
            let body = postNotificationEmailTemplate(
              `${mailNotifyUser.firstName} ${mailNotifyUser.lastName}`,
              postInfo.metaTitle,
              postInfo.permalink,
              "support@bestnewshub.com"
            );
            await sendMail(
              mailNotifyUser[i].email,
              "New Notification from Best News Hub",
              body
            );
          }
          for (let i = 0; i < notifyUser.length; i++) {
            await databases.notifications.create({
              _user: notifyUser[i].id,
              notificationsTitle: "New Post Published",
              notificationContent: postInfo.metaTitle,
              permalink: postInfo.permalink,
            });
          }
        }
      }
      return res.status(200).json({
        success: true,
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
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  bulkAction,
};
