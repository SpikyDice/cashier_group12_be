//multer (file uploader)
const path = require("path");
const multer = require("multer");

//------------------------- multer ----------------------------

//1. define storage to store uploaded files
const storage = multer.diskStorage({
  // SAVE TO:
  destination: function (req, file, cb) {
    cb(null, "public");
    //         ^ folder name
  },
  // AS...
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname));
  },
});

//2. upload image to localhost storage (callback function)
const upload = multer({ storage });

//3. add image's path to mysql database => done in index.js
module.exports = upload;
