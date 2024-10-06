const Rating = require("../models/rating");
const Post = require("../models/post");

const createRating = async (req, res) => {
  try {
    const { postId, buyerId, sellerId, noOfStars, comment } = req.body;

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).json({ message: "Failed to find the post!" });

    await Post.findOneAndUpdate({ _id: postId }, { rated: true });

    const rating = new Rating({
      noOfStars: noOfStars,
      comment: comment || undefined,
      postId: postId,
      userId: sellerId,
      author: buyerId,
    });
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
