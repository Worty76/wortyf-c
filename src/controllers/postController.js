const Post = require("../models/post");
const User = require("../models/user");
const Topic = require("../models/topic");
const Comment = require("../models/comment");
const Like = require("../models/like");

// Read
const readPost = async (req, res) => {
  try {
    const posts = await Post.find({});

    if (posts)
      return res
        .status(200)
        .send({ message: "Successfully get posts", data: posts });

    return res.status(400).send({ message: "Failed to get posts" });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

//
const readSpecificPost = async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id });

    const author = await User.findById({ _id: post[0].author._id });

    // const like = await Like.findOne({
    //   post_id: req.params.id,
    //   user_id: post[0].author._id,
    // });

    if (post)
      return res.status(200).send({
        message: "Successfully get posts",
        data: post,
        author: author,
      });

    return res.status(400).send({ message: "Failed to get post" });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

// Create
const createPost = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById({ _id: userId });

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    let topicArray = [];
    if (req.body.topic) {
      let topics = req.body.topic.split(",");
      for (let i = 0; i < topics.length; i++) {
        let topic = await Topic.findOne({ name: topics[i] });
        if (topic) {
          topicArray.push(topic);
        } else {
          let newTopic = new Topic({
            name: topics[i].name,
            color: topics[i].color,
          });
          await newTopic.save();
          topicArray.push(topics[i]);
        }
      }
    }

    let timestamps = new Date().toLocaleString();
    const post = new Post({
      title: req.body.title,
      description: req.body.description || null,
      content: req.body.content,
      author: {
        _id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
      topic: topicArray || null,
      createdAt: timestamps,
    });

    // Create a new post in MongoDB
    console.log(post);
    await post
      .save()
      .then(() => {
        res
          .status(200)
          .json({ message: "Successfully created a post", data: post });
      })
      .catch((error) => {
        res
          .status(400)
          .send({ message: "Failed to create a post", error: error });
      });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

// Update
const updatePost = async (req, res) => {
  try {
    const newPost = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    };

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      newPost
    );
    if (updatedPost)
      return res
        .status(200)
        .send({ message: "Successfully updated a post!", data: updatedPost });
  } catch (error) {
    res.status(500).send({ message: "Could not find any post!", error: error });
  }
};

// Delete
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post)
      return res.status(400).json({ message: "This post doesn't exist!" });

    await Post.findByIdAndDelete({ _id: req.params.id });

    await Comment.deleteMany({ post_id: req.params.id });
    res.status(200).json({ message: "Successfully deleted a post" });
  } catch (error) {
    res.status(500).json({ message: "Interval error", error: error });
  }
};

const postController = {
  readPost,
  createPost,
  updatePost,
  deletePost,
  readSpecificPost,
};

module.exports = postController;
