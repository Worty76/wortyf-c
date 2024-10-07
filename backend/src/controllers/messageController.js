const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const Message = require("../models/message.js");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  console.log(req.body);

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username avatar_url");
    message = await message.populate({
      path: "chat",
      populate: {
        path: "post",
        populate: { path: "buyer", select: "username email avatar_url" },
      },
    });

    message = await User.populate(message, {
      path: "chat.users",
      select: "username avatar_url email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessages = async (req, res) => {
  console.log(req.params);
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatar_url email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { sendMessage, allMessages };
