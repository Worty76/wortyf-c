const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  likes: [
    {
      type: Schema.Types.Object,
      ref: "Like",
      default: [],
    },
  ],
  topic: [
    {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      default: [],
      // required: true
    },
  ],
  solved: {
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
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Post", PostSchema);
