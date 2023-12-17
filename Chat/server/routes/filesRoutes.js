const express = require("express");
const {
  getFileController,
  serveFileController,
} = require("../controllers/filesController");

const router = express.Router();

//getFile || METHOD GET
router.get("/:filename", getFileController);
//getImage || METHOD GET
router.get("/serveFile/:filename", serveFileController);

module.exports = router;
