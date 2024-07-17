const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: Boolean,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    avatar_url: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    from: {
      type: String,
    },
    bio: {
      type: String,
      minlength: 20,
      maxlength: 250,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: { joined_at: "created_at" },
  }
);

module.exports = mongoose.model("User", UserSchema);
