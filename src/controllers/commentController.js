const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
// Read
const readComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const post = await Post.findOne({ _id: postId });

    post.comments.forEach(function (comment) {
      if (comment._id.valueOf() === commentId) {
        return res.status(200).json({
          message: "Successfully get comment",
          data: comment.comments,
        });
      }
    });
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
        avatar_url: {
          data: user.avatar_url.data,
          contentType: user.avatar_url.contentType,
        },
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

    const user = User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    post.comments.forEach(async function (comment) {
      if (comment._id == commentId) {
        comment.text = req.body.text;
        await Comment.findOneAndUpdate(
          { _id: commentId },
          { text: req.body.text }
        );
        const newPost = new Post(post);
        await newPost
          .save()
          .then(() => {
            res.send({
              comments: newPost.comments,
              message: "Successfully updated a comment",
            });
          })
          .catch((error) => {
            res.send({ message: "Failed to update a comment", error: error });
          });
      }
    });
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

    const user = User.findById({ _id: userId });

    if (!user)
      return res.status(400).json({ message: "Could not find the user!" });

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).json({ message: "Could not find the post!" });

    post.comments.forEach(function (comment) {
      if (comment._id == commentId) {
        Object.keys(comment).map((key) => delete comment[key]);
      }
    });

    post.comments = post.comments.filter(
      (comment) => Object.keys(comment).length !== 0
    );

    await Comment.findByIdAndDelete({ _id: commentId });
    await Comment.deleteMany({ comment_father: commentId });

    const newPost = new Post(post);
    await newPost
      .save()
      .then(() => {
        res.status(200).json({
          comments: newPost.comments,
          message: "Successfully deleted a comment",
        });
      })
      .catch((error) => {
        res.json({ message: "Failed to delete a comment", error: error });
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Mark comment as correct answer
const markAsAnswer = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.CommentId;

    const post = await Post.findById({ _id: postId });

    if (post.solved === false) {
      post.comments.forEach(async function (comment) {
        if (comment._id.valueOf() === commentId) {
          comment.correctAns = true;
          post.solved = true;

          const newPost = new Post(post);
          await newPost
            .save()
            .then(() => {
              res.json({ message: "Successfully mark a comment as answer" });
            })
            .catch((error) => {
              res.json({
                message: "Failed to mark a comment as answer",
                error: error,
              });
            });
        }
      });
    } else {
      res.status(400).json({ message: "There's already a correct answer" });
    }
  } catch (error) {
    res.status(500).json({ message: "Interval error", error: error });
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

    const parentComment = await findAuthorOfComment(postId, commentId);

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).send({ message: "Could not find the post!" });

    post.comments.forEach(async function (comment) {
      if (comment._id == commentId) {
        await reply.save();
        comment.comments.push(reply);
        const newPost = new Post(post);
        await newPost
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
      }
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

    let currentReplies = [];
    post.comments.forEach(async function (comment) {
      if (comment._id == commentId) {
        comment.comments.forEach(async function (subComment) {
          if (subComment._id == subCommentId) {
            subComment.text = req.body.text;

            await Comment.findOneAndUpdate(
              { _id: subCommentId },
              { text: req.body.text }
            );
            currentReplies = comment;
            const newPost = new Post(post);
            await newPost
              .save()
              .then(() => {
                res.send({
                  message: "Successfully updated a reply",
                  replies: currentReplies.comments,
                });
              })
              .catch((error) => {
                res.send({ message: "Failed to update a reply", error: error });
              });
          }
        });
      }
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

    let currentReplies = [];
    post.comments.forEach(async function (comment) {
      if (comment._id == commentId) {
        comment.comments.forEach(async function (subComment) {
          if (subComment._id == subCommentId) {
            Object.keys(subComment).map((key) => delete subComment[key]);
          }
        });
        comment.comments = comment.comments.filter(
          (comment) => Object.keys(comment).length !== 0
        );
        currentReplies = comment;
        await Comment.findByIdAndDelete({ _id: subCommentId });
        const newPost = new Post(post);
        await newPost
          .save()
          .then(() => {
            res.status(200).json({
              message: "Successfully deleted a reply",
              replies: currentReplies.comments,
            });
          })
          .catch((error) => {
            res
              .status(400)
              .json({ message: "Failed to delete a reply", error: error });
          });
      }
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

const commentController = {
  readComment,
  createComment,
  updateComment,
  deleteComment,
  createReply,
  updateReply,
  deleteReply,
  markAsAnswer,
};

module.exports = commentController;
