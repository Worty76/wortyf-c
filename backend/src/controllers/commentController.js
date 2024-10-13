const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");
// Read
const readComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.find({ comment_father: commentId });

    if (comment) {
      return res.status(200).json({
        message: "Successfully get comment",
        data: comment,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

// Create
const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    let timestamps = new Date().toLocaleString();

    const comment = new Comment({
      text: req.body.text,
      author: {
        _id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
      post_id: postId,
      createdAt: timestamps,
    });

    post.comments.push(comment);
    await comment.save();
    await post.save();

    return res
      .status(200)
      .send({ message: "Successfully created a comment", data: comment });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

// Update
const updateComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.CommentId;

    const user = await User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    await Comment.findOneAndUpdate({ _id: commentId }, { text: req.body.text });

    const comments = await Comment.find({
      post_id: postId,
      comment_father: undefined,
    });

    res.send({ comments: comments, message: "Successfully updated a comment" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

// Delete
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.CommentId;

    const user = await User.findById({ _id: userId });

    if (!user)
      return res.status(400).json({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).json({ message: "Could not find the post!" });

    await Comment.deleteMany({ comment_father: commentId, post_id: postId });
    post.comments = removeObjectWithId(post.comments, commentId);
    await Comment.findByIdAndDelete({ _id: commentId });
    await Notification.deleteMany({
      postId: postId,
      senderId: userId,
      type: "comment",
    });

    const newPost = new Post(post);
    await newPost.save();
    const comments = await Comment.find({
      post_id: postId,
      comment_father: undefined,
    });
    res.status(200).json({
      comments: comments,
      message: "Successfully deleted a comment",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//------------------------------------------------------------ REPLY -------------------------------------------------------------------------//
// Create
const createReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.CommentId;

    const user = await User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    let timestamps = new Date().toLocaleString();

    const parentComment = await findAuthorOfComment(postId, commentId);

    const comment = await Comment.findById({ _id: commentId });

    if (!comment)
      return res.status(400).send({ message: "Could not find the comment!" });

    const reply = new Comment({
      text: req.body.text,
      comment_father: commentId,
      author: {
        _id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
      post_id: postId,
      createdAt: timestamps,
    });

    comment.comments.push(reply);
    await reply.save();
    await comment
      .save()
      .then(() => {
        res.json({
          message: "Successfully created a reply",
          reply: reply,
          replyTo: parentComment,
        });
      })
      .catch((error) => {
        res.send({ message: "Failed to create a reply", error: error });
      });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

// Update
const updateReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.CommentId;
    const subCommentId = req.params.SubCommentId;

    const user = User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    const comment = await Comment.findById({ _id: commentId });

    if (!comment)
      return res.status(400).send({ message: "Could not find the comment!" });

    const reply = await Comment.findById({ _id: subCommentId });

    if (!reply)
      return res.status(400).send({ message: "Could not find the reply!" });

    await Comment.findOneAndUpdate(
      { _id: subCommentId },
      { text: req.body.text }
    );

    const replies = await Comment.find({
      post_id: postId,
      comment_father: commentId,
    });

    res.send({
      message: "Successfully updated a reply",
      replies: replies,
    });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

// Delete
const deleteReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.CommentId;
    const subCommentId = req.params.SubCommentId;

    const user = User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    const comment = await Comment.findById({ _id: commentId });

    if (!comment)
      return res.status(400).send({ message: "Couldn't find the comment!" });

    const reply = await Comment.findById({ _id: subCommentId });

    if (!reply)
      return res.status(400).send({ message: "Couldn't find the reply!" });

    await Comment.findByIdAndDelete({
      _id: subCommentId,
      comment_father: commentId,
    });
    comment.comments = removeObjectWithId(comment.comments, subCommentId);
    const newComment = new Comment(comment);
    await comment.save(newComment);
    const replies = await Comment.find({
      post_id: postId,
      comment_father: commentId,
    });
    res.status(200).json({
      replies: replies,
      message: "Successfully deleted a reply",
    });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

// Function that finds the author of the reply
const findAuthorOfComment = async (postId, commentId) => {
  const post = await Post.findById({ _id: postId });
  let user_id;
  post.comments.forEach(async function (comment) {
    if (comment._id === commentId) {
      user_id = comment.user_id;
    }
  });
  return user_id;
};

function removeObjectWithId(arr, id) {
  const objWithIdIndex = arr.findIndex((obj) => obj._id.valueOf() === id);

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }

  return arr;
}

const commentController = {
  readComment,
  createComment,
  updateComment,
  deleteComment,
  createReply,
  updateReply,
  deleteReply,
};

module.exports = commentController;
