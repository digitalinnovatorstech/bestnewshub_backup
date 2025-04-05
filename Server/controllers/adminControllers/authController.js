const databases = require("../../config/database/databases");
const bcrypt = require("bcrypt");
const createTokens = require("../../utils/jwt");
const moment = require("moment");
const { sendMail } = require("../../utils/userMailer");
const { validatePassword } = require("../../utils/validatePassword");
const { welcomeEmailTemplate } = require("../../mailTemplates/authMail");
const { generateUniqueUserName } = require("../../utils/generateUsername");
const { Op } = require("sequelize");

const createUser = async (req, res) => {
  try {
    let inputData = req.body;
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
        message: "Employee with this phone number already exists",
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
    if (req.files) {
      inputData.profilePhoto = req.file.location;
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
      await databases.generalSetting.create({
        _user: userDetails.id,
      });
      let sub = `Welcome to Best News Bub – Your Account Details`;
      let msg = await welcomeEmailTemplate(
        `${user.email} or ${user.userName}`,
        inputData.password,
        "https://bestnewshub.com/"
      );
      await sendMail(user.email, sub, msg);
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
        conditions.where.status = status.toUpperCase();
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
    let countConditions = {
      where: conditions.where,
    };
    const totalUsers = await databases.users.count(countConditions);
    const users = await databases.users.findAll(conditions);
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
        {
          model: databases.userCategory,
          as: "userCategory",
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

    if (inputData.password) {
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
    }

    await databases.users.update(
      {
        firstName: inputData.firstName,
        lastName: inputData.lastName,
        email: inputData.email,
        password: inputData.password,
        countryCode: inputData.countryCode,
        phoneNumber: inputData.phoneNumber,
        userType: inputData.userType,
        profilePhoto: req.file ? req.file.location : userExists.profilePhoto,
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

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message,
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
      message: "Internal Server Error",
      data: error.message,
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
        message: "Invalid email or password",
      });
    }

    if (user.status.toUpperCase() === "INACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated please contact to admin",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
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
          // where: { isRead: false },
        },
        {
          model: databases.generalSetting,
          as: "generalSetting",
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

    if (userData?.status?.toUpperCase() != "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Your account is currently inactive.",
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
      data: { otp },
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
      message: "Internal server error.",
      data: error.message,
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

const bulkActionUser = async (req, res) => {
  try {
    const { ids, status, action } = req.body;
    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'action' and 'ids' are required.",
      });
    }

    let affectedRows = 0;
    if (action.toUpperCase() === "DELETE") {
      affectedRows = await databases.users.destroy({
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
      affectedRows = await databases.users.update(
        { status },
        {
          where: {
            id: ids,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: `Updated status for ${affectedRows[0]} record(s) successfully.`,
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
  bulkActionUser,
};
