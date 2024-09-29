const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema({
  noOfStars: {
    type: Number,
    default: 0
  }
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
} ,{timestamp: true});

module.exports = mongoose.model("Rating", RatingSchema);
