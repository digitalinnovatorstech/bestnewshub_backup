require("dotenv").config();
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = async (req, res, next) => {
  const bearerHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  let WhiteListedDomain = process.env.WHITELIST_DOMAINS;
  let origin = req.headers["Origin"] || req.headers["origin"];
  if (!bearerHeader) {
    if (origin && WhiteListedDomain.includes(origin)) {
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Incomplete authentication information",
      });
    }
  }

  const accessToken = bearerHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    if (user) {
      req.user = user;
      return next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    if (decodedToken) {
      req.user = decodedToken;
      return next();
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user, please login.",
    });
  }

  if (origin && WhiteListedDomain.includes(origin)) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized user, please login.",
  });
};

module.exports = { auth };
