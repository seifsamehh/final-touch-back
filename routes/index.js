const express = require("express");
const ContactRoutes = require("./contactRoutes");
const router = express.Router();

router.use("/send-email", ContactRoutes);

module.exports = router;
