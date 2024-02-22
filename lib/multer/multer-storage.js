const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now().toString().replace(/:/g, "-") +
      Math.round(Math.random() * 1e9).toString();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

module.exports = { storage };
