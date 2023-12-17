const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Grid = require("gridfs-stream");
require("dotenv").config();

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const getFileController = asyncHandler(async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

const serveFileController = asyncHandler(async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log(filename);

    // Open download stream from GridFS
    const downloadStream = gridfsBucket.openDownloadStreamByName(filename);

    // Pipe the image data to the response
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = {
  getFileController,
  serveFileController,
};
