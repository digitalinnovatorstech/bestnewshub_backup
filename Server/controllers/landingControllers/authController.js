const databases = require("../../config/database/databases");
const bcrypt = require("bcrypt");
const createTokens = require("../../utils/jwt");
const moment = require("moment");
const { sendMail } = require("../../utils/userMailer");
const { validatePassword } = require("../../utils/validatePassword");
const {
  welcomeEmailTemplate,
  adminPendingUserEmailTemplate,
} = require("../../mailTemplates/authMail");
const { generateUniqueUserName } = require("../../utils/generateUsername");
const { Op, where } = require("sequelize");

const createUser = async (req, res) => {
  try {
    let inputData = req.body;
    if (
      inputData.userType.toUpperCase() !== "GUEST AUTHOR" &&
      inputData.userType.toUpperCase() !== "SUBSCRIBER"
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid user type",
      });
    }
    let isUserExist = await databases.users.findOne({
      where: { email: inputData.email },
      raw: true,
    });

    if (isUserExist) {
      return res.status(401).json({
        success: false,
        message: `Employee with this email already exists.`,
      });
    }

    let isPhoneNumberExist = await databases.users.findOne({
      where: { phoneNumber: inputData.phoneNumber },
    });

    if (isPhoneNumberExist) {
      return res.status(401).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }
    let validationResult = validatePassword(
      inputData.password,
      inputData.firstName,
      inputData.lastName
    );

    if (validationResult) {
      return res.status(401).json({
        success: false,
        message: validationResult,
      });
    }
    let hashPassword = await bcrypt.hash(inputData.password, 10);

    if (req?.files) {
      if (req.files.profilePhoto && req.files.profilePhoto?.length > 0) {
        inputData.profilePhoto = req.files.profilePhoto[0]?.location || null;
      }
      if (req.files.frontSide && req.files.frontSide.length > 0) {
        inputData.frontSide = req.files.frontSide[0]?.location || null;
      }
      if (req.files.backSide && req.files.backSide.length > 0) {
        inputData.backSide = req.files.backSide[0]?.location || null;
      }
    }
    if (inputData.userType.toUpperCase() === "GUEST AUTHOR") {
      inputData.status = "PENDING";
    }

    if (inputData.userType.toUpperCase() === "SUBSCRIBER") {
      inputData.isFirstLogin = false;
    }

    let userDetails = await databases.users.create({
      firstName: inputData.firstName,
      lastName: inputData.lastName,
      email: inputData.email,
      password: hashPassword,
      countryCode: inputData.countryCode,
      phoneNumber: inputData.phoneNumber,
      userType: inputData.userType?.toUpperCase(),
      profilePhoto: inputData.profilePhoto,
      joiningDate: inputData.joiningDate,
      idType: inputData.idType,
      idUrls: inputData.idType,
      idNumber: inputData.idNumber,
      qualification: inputData.qualification,
      houseNo: inputData.houseNo,
      country: inputData.country,
      state: inputData.state,
      city: inputData.city,
      zipCode: inputData.zipCode,
      streetName: inputData.streetName,
      displayName: inputData.displayName,
      status: inputData.status || "ACTIVE",
      isFirstLogin: inputData.isFirstLogin || true,
    });

    if (userDetails) {
      let userName = await generateUniqueUserName(
        inputData.firstName,
        inputData.lastName,
        userDetails.id
      );
      await userDetails.update({ userName: userName });
      let user = await databases.users.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        where: { id: userDetails.id },
        raw: true,
      });

      let sub = `Welcome to Best News Bub – Your Account Details`;
      let msg = await welcomeEmailTemplate(
        `${user.email} or ${user.userName}`,
        inputData.password,
        "http://localhost:5173/"
      );

      if (inputData.userType.toUpperCase() != "SUBSCRIBER") {
        await sendMail(user.email, sub, msg);
      }

      if (inputData.userType.toUpperCase() === "GUEST AUTHOR") {
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
            notificationsTitle: "Pending Guest Author Review: New Submission",
            notificationContent:
              "A new Guest Author has registered. Please review and take action.",
          });
          let body = adminPendingUserEmailTemplate(
            `${userDetails.firstName} ${userDetails.lastName}`,
            userDetails.email
          );
          await sendMail(
            adminMailNotifyUser[i].email,
            `New Author Request: ${userDetails.firstName} ${userDetails.lastName} - ${userDetails.email} on Best News Hub`,
            body
          );
        }
      }

      if (inputData.preference) {
        let categories = inputData.preference.split(",").map(Number);
        categories?.map(async (category) => {
          await databases.userCategory.create({
            _user: userDetails.id,
            _category: category,
          });
        });
      }

      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Failed to create user",
    });
  } catch (error) {
    return res.status(501).json({
      success: true,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    let { perPage, currentPage, status, userType, searchQuery, verified } =
      req.query;
    currentPage = parseInt(currentPage) || 1;
    const limit = parseInt(perPage) || 10;
    const offset = (currentPage - 1) * limit;

    let conditions = {
      attributes: { exclude: ["password"] },
      order: [["firstName", "ASC"]],
      limit: limit,
      offset: offset,
      where: {},
    };

    if (status) {
      if (status.toUpperCase() != "ALL") {
        conditions.where.status = status;
      }
    }

    if (userType) {
      if (userType.toUpperCase() != "ALL") {
        conditions.where.userType = userType.toUpperCase();
      }
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const searchTerms = searchQuery.trim().split(" ");
      if (searchTerms.length > 1) {
        conditions.where[Op.and] = [
          { firstName: { [Op.like]: `%${searchTerms[0]}%` } },
          { lastName: { [Op.like]: `%${searchTerms[1]}%` } },
        ];
      } else {
        conditions.where[Op.or] = [
          { firstName: { [Op.like]: `%${searchQuery}%` } },
          { lastName: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
    }

    if (verified) {
      conditions.where.isVerified =
        verified.toUpperCase() === "PENDING" ? false : true;
    }

    const { rows: users, count: totalUsers } =
      await databases.users.findAndCountAll(conditions);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
      },
      pagination: {
        totalItems: totalUsers,
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

const getUserById = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: true,
        message: "Please pass User Id",
      });
    }
    const users = await databases.users.findOne({
      attributes: { exclude: ["password"] },
      where: { id: id },
      include: [
        {
          model: databases.posts,
          as: "posts",
          attributes: [
            "id",
            "title",
            "status",
            "metaDescription",
            "metaTitle",
            "permalink",
            "publishedAt",
            "createdAt",
          ],
        },
      ],
    });

    if (!users) {
      return res.status(200).json({
        success: false,
        message: "User not found",
        data: users || "",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

/*------------------------ Update the user  ------------------------------*/

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let inputData = req.body;

    let userExists = await databases.users.findOne({
      where: { id },
      raw: true,
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (inputData.email && inputData.email !== userExists.email) {
      let isEmailExist = await databases.users.findOne({
        where: { email: inputData.email },
        raw: true,
      });

      if (isEmailExist) {
        return res.status(401).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
    }

    if (
      inputData.phoneNumber &&
      inputData.phoneNumber !== userExists.phoneNumber
    ) {
      let isPhoneNumberExist = await databases.users.findOne({
        where: { phoneNumber: inputData.phoneNumber },
        raw: true,
      });

      if (isPhoneNumberExist) {
        return res.status(401).json({
          success: false,
          message: "Phone number is already in use by another user.",
        });
      }
    }

    if (req?.files) {
      if (req.files.profilePhoto && req.files.profilePhoto?.length > 0) {
        inputData.profilePhoto = req.files.profilePhoto[0]?.location || null;
      }
      if (req.files.frontSide && req.files.frontSide.length > 0) {
        inputData.frontSide = req.files.frontSide[0]?.location || null;
      }
      if (req.files.backSide && req.files.backSide.length > 0) {
        inputData.backSide = req.files.backSide[0]?.location || null;
      }
    }
    if (inputData.userType?.toUpperCase() === "GUEST AUTHOR") {
      inputData.status = "PENDING";
    }
    if (inputData.preference > 0) {
      let categories = inputData.preference.split(",").map(Number);
      await databases.userCategory.destroy({
        where: { _user: userExists.id },
      });
      categories.map(async (category) => {
        await databases.userCategory.create({
          _user: userExists.id,
          _category: category,
        });
      });
    }
    await databases.users.update(
      {
        firstName: inputData.firstName,
        lastName: inputData.lastName,
        email: inputData.email,
        countryCode: inputData.countryCode,
        phoneNumber: inputData.phoneNumber,
        userType: inputData.userType,
        profilePhoto: inputData.profilePhoto || userExists.profilePhoto,
        status: inputData.status,
        joiningDate: inputData.joiningDate,
        blogPostCount: inputData.blogPostCount,
        lastLogin: inputData.lastLogin,
        idType: inputData.idType,
        idUrls: inputData.idType,
        idNumber: inputData.idNumber,
        qualification: inputData.qualification,
        houseNo: inputData.houseNo,
        country: inputData.country,
        state: inputData.state,
        city: inputData.city,
        zipCode: inputData.zipCode,
        streetName: inputData.streetName,
        displayName: inputData.displayName,
      },
      { where: { id } }
    );

    let updatedUser = await databases.users.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: { id },
      raw: true,
    });
    if (updatedUser.status === "PENDING") {
      let adminMailNotifyUser = await databases.users.findAll({
        where: { userType: "ADMIN", status: "ACTIVE" },
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

      for (let i = 0; i < adminMailNotifyUser.length; i++) {
        await databases.notifications.create({
          _user: adminMailNotifyUser[i].id,
          notificationsTitle: "Pending Guest Author Review: New Submission",
          notificationContent:
            "A new Guest Author has registered. Please review and take action.",
        });
        let body = adminPendingUserEmailTemplate(
          `${updatedUser.firstName} ${updatedUser.lastName}`,
          updatedUser.email
        );
        await sendMail(
          adminMailNotifyUser[i].email,
          `New Author Request: ${updatedUser.firstName} ${updatedUser.lastName} - ${userEmail} on Best News Hub`,
          body
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*------------------------ Delete the user  ------------------------------*/
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    let userExists = await databases.users.findOne({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await databases.users.destroy({
      where: { id },
      raw: true,
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*------------------------ User Login  ------------------------------*/
const loginUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if ((!email && !userName) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }
    let user;
    if (email) {
      user = await databases.users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          email,
        },
        raw: true,
      });
    } else if (userName) {
      user = await databases.users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { userName },
        raw: true,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email ",
      });
    }

    if (user?.status?.toUpperCase() === "INACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Your account is currently inactive.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };
    const token = await createTokens(payload);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Failed to generate token",
      });
    }

    let userData = await databases.users.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: { email: user.email },
      include: [
        {
          model: databases.notifications,
          as: "notifications",
        },
      ],
    });
    await userData.update({ lastLogin: new Date() });
    await databases.users.update(
      { isFirstLogin: false },
      { where: { id: user.id } }
    );

    return res.status(200).json({
      success: true,
      message: "Login Success",
      data: { token, userData },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const emailVerifyOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await databases.users.findOne({
      where: { email },
      raw: true,
    });
    if (userData) {
      return res.status(404).json({
        success: false,
        message: "The provided email address is already registered.",
      });
    }
    const checkEmailExisting = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    const expireAt = moment().add(1, "minutes").format();
    var otp = Math.floor(100000 + Math.random() * 900000);

    if (!checkEmailExisting) {
      await databases.usersOtp.create({
        otp,
        email: email,
        expireAt,
      });
    } else {
      await databases.usersOtp.update(
        {
          otp,
          expireAt,
        },
        { where: { email } }
      );
    }
    const message = `Dear User,\n\nYour One-Time Password (OTP) is: ${otp}. Please use it within the next 1 minute to verify your email and complete the forget password process.\n\nIf you have any questions or concerns, feel free to contact our support team at support@cryovault.com.\n\nBest regards,\nCryovault`;

    await sendMail(email, "OTP Verification Code- Cryovault", message);

    return res.status(200).json({
      success: true,
      message: "OTP created. Please check your email.",
      // data: { otp },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.params;
    const userData = await databases.users.findOne({
      where: { email },
      raw: true,
    });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "The provided email address is not registered.",
      });
    }
    if (userData.status !== "Active") {
      return res.status(401).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the admin for assistance.",
      });
    }
    const checkEmailExisting = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    const expireAt = moment().add(1, "minutes").format();
    var otp = Math.floor(100000 + Math.random() * 900000);

    if (!checkEmailExisting) {
      await databases.usersOtp.create({
        otp,
        email: email,
        expireAt,
      });
    } else {
      await databases.usersOtp.update(
        {
          otp,
          expireAt,
        },
        { where: { email } }
      );
    }
    const message = `Dear User,\n\nYour One-Time Password (OTP) is: ${otp}. Please use it within the next 1 minute to verify your email and complete the forget password process.\n\nIf you have any questions or concerns, feel free to contact our support team at support@cryovault.com.\n\nBest regards,\nCryovault`;

    await sendMail(email, "OTP Verification Code- Cryovault", message);

    return res.status(200).json({
      success: true,
      message: "OTP created. Please check your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const otpDetail = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    if (!otpDetail) {
      return res.status(404).json({
        success: true,
        message: "OTP not found or already used.",
      });
    }

    var currentTime = new Date(moment().format());

    if (currentTime > otpDetail.expireAt) {
      return res.status(400).json({
        success: false,
        message: "Your OTP has expired.",
      });
    }

    if (otpDetail.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP.",
      });
    }
    await databases.usersOtp.destroy({ where: { email } });

    return res.status(200).json({
      success: true,
      message: "OTP verification successfully completed.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    const user = await databases.users.findOne({ where: { email }, raw: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let validationResult = validatePassword(
      newPassword,
      user.firstName,
      user.lastName
    );

    if (validationResult) {
      return res.status(401).json({
        success: false,
        message: validationResult,
      });
    }

    hashPassword = await bcrypt.hash(newPassword, 10);

    const passwordChanged = await databases.users.update(
      { password: hashPassword },
      { where: { email } }
    );
    if (passwordChanged) {
      return res.status(200).json({
        success: true,
        message: "Your password has been changed successfully.",
      });
    }
  } catch (error) {
    log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPasswordByAdmin = async (req, res) => {
  try {
    if (req.user.userType?.toUpperCase() != "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    const { newPassword } = req.query;
    const { userId } = req.params;

    const user = await databases.users.findOne({
      where: { id: userId },
      raw: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let validationResult = validatePassword(
      newPassword,
      user.firstName,
      user.lastName
    );

    if (validationResult) {
      return res.status(401).json({
        success: false,
        message: validationResult,
      });
    }

    hashPassword = await bcrypt.hash(newPassword, 10);

    const passwordChanged = await databases.users.update(
      { password: hashPassword },
      { where: { id: userId } }
    );
    if (passwordChanged) {
      return res.status(200).json({
        success: true,
        message: "Your password has been changed successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateGeneralSetting = async (req, res) => {
  try {
    let inputData = req.body;
    inputData._defaultCategory =
      !inputData._defaultCategory || inputData._defaultCategory === "null"
        ? 1
        : inputData._defaultCategory;

    let generalSettingInfo = await databases.generalSetting.findOne({
      where: { _user: req.user.id },
    });
    if (req?.files) {
      if (req.files.siteLogo && req.files.siteLogo?.length > 0) {
        inputData.siteLogo = req.files.siteLogo[0]?.location || null;
      }
      if (req.files.favicon && req.files.favicon.length > 0) {
        inputData.favicon = req.files.favicon[0]?.location || null;
      }
      if (req.files.SEOImageUrl && req.files.SEOImageUrl.length > 0) {
        inputData.SEOImageUrl = req.files.SEOImageUrl[0]?.location || null;
      }
    }
    let generalSettingData;
    if (!generalSettingInfo) {
      if (req.user.userType?.toUpperCase() === "ADMIN") {
        generalSettingData = await databases.generalSetting.create({
          ...inputData,
          _user: req.user.id,
        });
      } else {
        if (
          inputData.metaTitle ||
          inputData.metaDescription ||
          inputData.metaTags
        ) {
          return res.status(403).json({
            success: false,
            message: "You don't have permission to craete/update this field.",
          });
        }
        generalSettingData = await databases.generalSetting.create({
          ...inputData,
          _user: req.user.id,
        });
      }
    } else {
      if (req.user.userType?.toUpperCase() === "ADMIN") {
        if (
          inputData.metaTitle ||
          inputData.metaDescription ||
          inputData.metaTags
        ) {
          let adminsIds = await databases.users.findAll({
            where: { userType: "ADMIN" },
            attributes: ["id"],
          });
          const adminIdsArray = adminsIds.map((admin) => admin.id);
          await databases.generalSetting.update(
            {
              metaTitle: inputData.metaTitle,
              metaDescription: inputData.metaDescription,
              metaTags: inputData.metaTags,
              ...inputData,
            },
            {
              where: { _user: adminIdsArray },
            }
          );
        } else {
          generalSettingData = await generalSettingInfo.update({
            ...inputData,
          });
        }
      } else {
        if (
          inputData.metaTitle ||
          inputData.metaDescription ||
          inputData.metaTags
        ) {
          return res.status(403).json({
            success: false,
            message: "You don't have permission to update this field.",
          });
        }
        generalSettingData = await generalSettingInfo.update({
          ...inputData,
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "General setting updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getGeneralSetting = async (req, res) => {
  try {
    const generalSettingData = await databases.generalSetting.findOne({
      where: { _user: req.user.id },
      raw: true,
    });
    if (!generalSettingData) {
      return res.status(404).json({
        success: false,
        message: "General setting not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "General setting fetched successfully.",
      data: generalSettingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPasswordSendOtp,
  otpVerification,
  resetPassword,
  resetPasswordByAdmin,
  updateGeneralSetting,
  getGeneralSetting,
  emailVerifyOTP,
};
