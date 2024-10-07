const Rating = require("../models/rating");
const Post = require("../models/post");
const User = require("../models/user");

const createRating = async (req, res) => {
  try {
    const { postId, buyerId, sellerId, noOfStars, comment } = req.body;

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).json({ message: "Failed to find the post!" });

    const user = await User.findById({ _id: sellerId });

    if (!user)
      return res.status(400).json({ message: "Failed to find the user!" });

    await Post.findOneAndUpdate({ _id: postId }, { rated: true });

    const rating = new Rating({
      noOfStars: noOfStars,
      comment: comment || undefined,
      postId: postId,
      userId: sellerId,
      author: buyerId,
    });

    await User.findByIdAndUpdate(
      { _id: sellerId },
      { $push: { ratings: rating } }
    );

    await rating.save();
    res.status(200).json({ message: "Successfully rated a post" });
  } catch (error) {
    res.status(500).json({ message: "Interval error", error: error });
  }
};

const ratingController = {
  createRating,
};

module.exports = ratingController;
