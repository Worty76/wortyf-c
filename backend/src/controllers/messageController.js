const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const Message = require("../models/message.js");
const cloudinary = require("../utils/cloudinary.js");
const formidable = require("formidable");
const mongoose = require("mongoose");

const sendMessage = async (req, res) => {
  const body = await doSomethingWithNodeRequest(req);

  if (!body.chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  let newMessage;

  if (body.image) {
    const results = await cloudinary.uploader.upload(
      body.image.filepath,
      async function (err, result) {
        if (err) {
          console.error(err);
        }

        return result;
      }
    );

    newMessage = {
      sender: req.user._id,
      image: results.secure_url,
      chat: body.chatId,
    };
  }

  if (body.content && !body.image) {
    newMessage = {
      sender: req.user._id,
      content: body.content,
      chat: body.chatId,
    };
  }

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
    await Chat.findByIdAndUpdate(body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    console.log(error);
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

function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(fields, files);

      resolve({ ...fields, ...files });
    });
  });
}

module.exports = { sendMessage, allMessages };
