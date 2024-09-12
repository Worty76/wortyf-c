const Like = require("../models/like");
const Post = require("../models/post");

// Like post
async function likePost(req, res) {
  try {
    const user = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById({ _id: postId });

    if (!post) res.status(400).send({ message: "Could not find the post" });

    const like = await Like.findOne({ post_id: postId, user_id: user });

    if (!like) {
      const like = new Like({
        user_id: user,
        post_id: postId,
      });
      post.likes.push(like);
      await like.save();
      await post.save();
      return res
        .status(200)
        .json({ message: "Successfully like a post", data: post.likes });
    }

    return res.status(400);
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
}

async function unLikePost(req, res) {
  try {
    const user = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById({ _id: postId });

    if (!post) res.status(400).send({ message: "Could not find the post" });

    const like = await Like.findOne({ post_id: postId, user_id: user });

    await Like.findOneAndDelete({ post_id: postId, user_id: user });
    post.likes = post.likes.filter(
      (e) => e._id.valueOf() !== like._id.valueOf()
    );
    if (post.save()) {
      return res
        .status(200)
        .json({ message: "Successfully unlike a post", data: post.likes });
    } else {
      return res.status(400).json({ message: "Error", error: error });
    }
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
}

module.exports = likeController = {
  likePost,
  unLikePost,
};
