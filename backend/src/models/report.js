const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    message: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Report", ReportSchema);
