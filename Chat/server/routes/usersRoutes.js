const express = require("express");
const {
  searchUsersController,
  addUsersToBlockedListController,
  removeUsersFromBlockedListController,
  searchBlockedListUsersController,
  getUserController,
  updateUserController,
} = require("../controllers/usersController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

//searchUsers || METHOD GET
router.get("/searchUsers", requireSignIn, searchUsersController);

//getUser || METHOD GET
router.get("/getUser/:userId", requireSignIn, getUserController);

//updateUser || METHOD PUT
router.put("/updateUser/:userId", requireSignIn, updateUserController);

//addUsersToBlockedList || METHOD POST
router.post(
  "/addUsersToBlockedList",
  requireSignIn,
  addUsersToBlockedListController
);

//removeUsersFromBlockedList || METHOD POST
router.post(
  "/removeUsersFromBlockedList",
  requireSignIn,
  removeUsersFromBlockedListController
);

//getBlockedUsers || METHOD GET
router.get(
  "/searchBlockedListUsers",
  requireSignIn,
  searchBlockedListUsersController
);

module.exports = router;
