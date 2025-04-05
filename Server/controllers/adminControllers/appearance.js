const databases = require("../../config/database/databases");

const createAppearance = async (req, res) => {
  try {
    let { customCSS, customJS, name, src } = req.body;
    if (req.user.userType !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Permission Denied",
      });
    }
    const newAppearance = await databases.appearance.create({
      customCSS,
      customJS,
      name,
      src,
      _user: req.user.id,
    });
    if (newAppearance) {
      return res.status(200).json({
        success: true,
        message: "Appearance created successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Failed to create appearance.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAppearance = async (req, res) => {
  try {
    let { customCSS, customJS, id } = req.body;
    // const obj = new Function(`return ${customJS}`)();
    // console.log(obj);
    if (customJS) {
      if (typeof customJS === "string") {
        try {
          customJS = JSON.parse(customJS);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid JSON in format.",
          });
        }
      }
    }

    if (req.user.userType !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Permission Denied",
      });
    }
    let isExist;
    if (id) {
      isExist = await databases.appearance.findOne({
        where: { id: id },
      });
    }
    let newAppearance;
    if (!isExist) {
      newAppearance = await databases.appearance.create({
        customCSS,
        customJS: customJS?.script,
        name: customJS.name,
        src: customJS.src,
        active: customJS.active || true,
        _user: req.user.id,
      });
    } else {
      await isExist.update({
        customCSS,
        customJS: customJS?.script,
        name: customJS.name,
        src: customJS.src,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appearance ${isExist ? "updated" : "created"} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAppearances = async (req, res) => {
  try {
    const appearances = await databases.appearance.findAll();
    return res.status(200).json({
      success: true,
      data: appearances,
      message: "Appearances retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAppearancesLanding = async (req, res) => {
  try {
    const appearances = await databases.appearance.findAll({
      where: {
        active: true,
      },
    });
    return res.status(200).json({
      success: true,
      data: appearances,
      message: "Appearances retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const appearances = await databases.appearance.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).json({
      success: true,
      data: appearances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppearances = async (req, res) => {
  try {
    const appearances = await databases.appearance.findOne({
      where: { id: req.params.id },
    });
    if (!appearances) {
      return res.status(404).json({
        success: false,
        message: "No record found..",
      });
    }
    await appearances.destroy();
    return res.status(200).json({
      success: true,
      data: appearances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllAppearances,
  updateAppearance,
  deleteAppearances,
  getAllAppearancesLanding,
};
