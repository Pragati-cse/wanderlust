const multer = require("multer");
const { storage } = require("../utils/cloudConfig.js");

const upload = multer({ storage });

module.exports = upload;