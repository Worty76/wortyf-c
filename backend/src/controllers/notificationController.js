const Notification = require("../models/notification");
const Post = require("../models/post");
const Chat = require("../models/chat");
const User = require("../models/user");

const readNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId },
      { $set: { isRead: true } },
      { new: true }
    );

    return res.status(200).send({
      message: "Successfully read notifications",
      data: notification,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to read notifications" });
  }
};

const create = async (req, res) => {
  try {
    const { recipientId, postId, redirectUrl, type } = req.body;
    const { _id } = req.user;

    const post = await Post.findOne({ _id: postId });

    if (!post) return res.status(400).json({ message: "Post is not exist!" });

    const notification = new Notification({
      senderId: _id,
      recipientId: recipientId,
      postId: postId,
      redirectUrl: redirectUrl,
      type: type,
    });
    await notification.save();

    const newNotification = await Notification.findOne({
      _id: notification._id,
    }).populate("postId", "name");
    return res.status(200).send({
      message: "Successfully create notification",
      data: newNotification,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to create notification" });
  }
};

const fetchNotifications = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .populate({
        path: "post",
        populate: { path: "buyer", select: "username email avatar_url" },
      })
      .populate("post.buyer")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username avatar_url email",
        });
        return results;
      });

    const notifications = await Notification.find({
      recipientId: req.user._id,
    })
      .populate("postId", "name")
      .populate("senderId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Successfully fetched notifications",
      chats: chats,
      notifications: notifications,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const notificationController = {
  create,
  fetchNotifications,
  readNotification,
};

module.exports = notificationController;
