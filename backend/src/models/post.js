const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  price: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
      default: [],
    },
  ],
  topic: [
    {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      default: [],
    },
  ],
  sold: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  author: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Post", PostSchema);
