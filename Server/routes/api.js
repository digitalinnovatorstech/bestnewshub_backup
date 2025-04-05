const express = require("express");
const router = express.Router();

const adminRoutes = require("./adminRoutes");
const landingPageRoutes = require("./landingPageRoutes");

router.use("/admin", adminRoutes);
router.use("/landing", landingPageRoutes);

module.exports = router;
