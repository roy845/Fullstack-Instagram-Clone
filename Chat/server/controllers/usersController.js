const { hashPassword } = require("../helpers/authHelper");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const searchUsersController = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user.id, $nin: currentUser?.blockedUsers }, // Exclude the current user and users the current user has blocked
    blockedUsers: { $ne: req.user.id }, // Exclude users who have blocked the current user
  });

  res.status(200).send(users);
});

const addUsersToBlockedListController = asyncHandler(async (req, res) => {
  const { userIdsToBlock } = req.body;

  if (!userIdsToBlock || !Array.isArray(userIdsToBlock)) {
    return res.status(400).send({
      message: "Invalid input. Please provide an array of user IDs to block.",
    });
  }

  // Add the current user to the blockedUsers list of each user in userIdsToBlock
  const blockBackResult = await User.updateMany(
    { _id: { $in: userIdsToBlock } },
    { $addToSet: { blockedUsers: req.user.id } }
  );

  if (blockBackResult.nModified === 0) {
    return res.status(400).send({
      message:
        "Failed to update the blocked list for the specified users or no changes were made.",
    });
  }

  res.status(200).send({
    message: "Users Blocked Successfully",
  });
});

const removeUsersFromBlockedListController = asyncHandler(async (req, res) => {
  const { userIdsToRemove } = req.body;

  if (!userIdsToRemove || !Array.isArray(userIdsToRemove)) {
    return res.status(400).send({
      message:
        "Invalid input. Please provide an array of user IDs to remove from the blocked list.",
    });
  }

  // Remove the current user from the blockedUsers list of each user in userIdsToRemove
  const unblockResult = await User.updateMany(
    { _id: { $in: userIdsToRemove } },
    { $pull: { blockedUsers: req.user.id } }
  );

  if (unblockResult.nModified === 0) {
    return res.status(400).send({
      message:
        "Failed to update the blocked list of the specified users or no changes were made.",
    });
  }

  res.status(200).send({
    message:
      "Successfully removed from the blocked lists of the specified users.",
  });
});

const searchBlockedListUsersController = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          blockedUsers: req.user.id,
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {
          blockedUsers: req.user.id,
        };

    const users = await User.find(keyword);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

const getUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by its ID
    const user = await User.findById(userId).select("-password"); // Excluding the password from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { updatedUser } = req.body;

    const user = await User.findById(userId);

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        name: updatedUser.name || user.name,
        email: updatedUser.email || user.email,
        password:
          updatedUser.password === ""
            ? user.password
            : await hashPassword(updatedUser.password),
        profilePic: updatedUser.profilePic === "" ? "" : updatedUser.profilePic,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      user: {
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        profilePic: updateUser.profilePic,
        createdAt: updateUser.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

module.exports = {
  searchUsersController,
  getUserController,
  updateUserController,
  addUsersToBlockedListController,
  removeUsersFromBlockedListController,
  searchBlockedListUsersController,
};
