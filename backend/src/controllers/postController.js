const Post = require("../models/post");
const User = require("../models/user");
const Topic = require("../models/topic");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Chat = require("../models/chat");
const formidable = require("formidable");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const Message = require("../models/message");
const Report = require("../models/report");

const getApprovedPosts = async (req, res) => {
  try {
    let perPage = 6;
    let page = Number(req.query.page) || 1;

    const posts = await Post.find({ approved: true })
      .populate("topic")
      .sort({ _id: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, posts) => {
        Post.countDocuments((err, count) => {
          if (err) {
            console.log(err);
          }
          res.send({
            message: "Successfully get posts",
            data: posts,
            pages: Math.ceil(count / perPage),
            current: page,
          });
        });
      });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

const getInApprovalPosts = async (req, res) => {
  try {
    // the 2nd argument is removing fields that you don't want to fetch
    const posts = await Post.find({ approved: false });

    if (posts)
      return res
        .status(200)
        .send({ message: "Successfully get posts", data: posts });

    return res.status(400).send({ message: "Failed to get posts" });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

const getSpecificPost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id })
      .populate("topic")
      .populate("likes");

    const author = await User.findById({ _id: post.author._id });

    const comments = await Comment.find({
      post_id: req.params.id,
      comment_father: undefined,
    });

    if (post)
      return res.status(200).send({
        message: "Successfully get post",
        post: post,
        author: author,
        comments: comments,
      });

    return res.status(400).send({ message: "Failed to get post" });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

const createPost = async (req, res) => {
  try {
    console.log("run");
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user)
      return res.status(400).send({ message: "Could not find the user!" });

    const body = await doSomethingWithNodeRequest(req);

    let imagesArray = [];

    if (body.images) {
      const images = Array.isArray(body.images) ? body.images : [body.images];
      for (let image of images) {
        await cloudinary.uploader.upload(
          image.filepath,
          async function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Error",
              });
            }
            imagesArray.push(result.secure_url);
            console.log(result);
          }
        );
      }
    }

    let topicArray = [];
    if (body.topic) {
      const topics = body.topic.split(",");
      for (const topicName of topics) {
        let topic = await Topic.findOne({ name: topicName.trim() });
        if (topic) {
          topicArray.push(topic);
        } else {
          const newTopic = new Topic({
            name: topicName.trim(),
            color: req.body.topicColors?.[topicName] || "#FFFFFF",
          });
          await newTopic.save();
          topicArray.push(newTopic);
        }
      }
    }

    const post = new Post({
      name: body.name,
      price: body.price || null,
      content: body.content,
      author: {
        _id: user._id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
      topic: topicArray,
      images: imagesArray,
      createdAt: body.date,
    });

    await post.save();

    res
      .status(200)
      .json({ message: "Successfully created a post", data: post });
    // .json({ message: "Successfully created a post", data: post });
  } catch (error) {
    res.status(500).send({ message: "Internal error", error: error.message });
  }
};

function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      // console.log("Parsed Fields: ", fields);
      // console.log("Parsed Files: ", files);
      resolve({ ...fields, ...files });
    });
  });
}

// Update
const updatePost = async (req, res) => {
  try {
    const newPost = {
      name: req.body.name,
      price: req.body.price,
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
    await Like.deleteMany({ post_id: req.params.id });
    await Report.deleteMany({ postId: req.params.id });

    res.status(200).json({ message: "Successfully deleted a post" });
  } catch (error) {
    res.status(500).json({ message: "Interval error", error: error });
  }
};

const searchPost = async (req, res) => {
  try {
    const searchQuery = decodeURIComponent(req.query.text);

    let searchCondition = {};
    let tags = [];
    let currentTag = "";
    let cleanSearchQuery = "";
    let inTag = false;
    let bracketCount = 0;

    for (let char of searchQuery) {
      if (char === "[") {
        if (inTag) {
          currentTag += char;
        } else {
          inTag = true;
        }
        bracketCount++;
      } else if (char === "]") {
        bracketCount--;
        if (bracketCount === 0 && inTag) {
          if (currentTag.trim()) {
            tags.push(currentTag.trim());
          }
          currentTag = "";
          inTag = false;
        } else {
          currentTag += char;
        }
      } else {
        if (inTag) {
          currentTag += char;
        } else {
          cleanSearchQuery += char;
        }
      }
    }

    if (currentTag.trim()) {
      tags.push(currentTag.trim());
    }

    cleanSearchQuery = cleanSearchQuery.trim();

    if (tags.length > 0) {
      const topics = await Topic.find({
        name: { $in: tags },
      }).distinct("_id");

      if (topics.length > 0) {
        searchCondition.topic = { $in: topics };
      }
    }

    if (cleanSearchQuery) {
      searchCondition.name = { $regex: cleanSearchQuery, $options: "i" };
    }

    const posts = await Post.find(searchCondition).populate("topic");

    if (posts.length > 0) {
      return res
        .status(200)
        .send({ message: "Successfully found posts", data: posts });
    } else {
      return res.status(200).send({ message: "No posts found", data: posts });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const getSortOptions = (option) => {
  switch (option) {
    case "Newest":
      return { _id: -1 };
    case "Oldest":
      return { _id: 1 };
    case "MostLikes":
      return { likes: -1 };
    default:
      return { _id: -1 };
  }
};

const getFilterOptions = (option) => {
  switch (option) {
    case "NotSold":
      return { sold: false };
    case "NoComments":
      return { comments: { $size: 0 } };
    default:
      return {};
  }
};

const filterPost = async (req, res) => {
  try {
    const { filters, tag, sort, name, page = 1 } = req.query;
    const perPage = 9;

    let query = { approved: true };
    let sortCriteria = { _id: -1 };
    if (filters) {
      query = { ...query, ...getFilterOptions(filters) };
    }

    if (tag) {
      const tagArray = decodeURIComponent(tag)
        .split(",")
        .map((t) => t.trim());
      const tagRegexPatterns = tagArray.map((tag) => new RegExp(tag, "i"));
      const topics = await Topic.find({
        name: { $in: tagRegexPatterns },
      }).distinct("_id");
      query.topic = { $in: topics };
    }

    if (name) {
      query.name = { $regex: decodeURIComponent(name), $options: "i" };
    }

    if (sort) {
      sortCriteria = getSortOptions(sort);
    }

    const posts = await Post.find(query)
      .populate("topic")
      .sort(sortCriteria)
      .skip(perPage * (Number(page) - 1))
      .limit(perPage);

    const count = await Post.countDocuments(query);

    res.send({
      message: "Successfully get posts",
      data: posts,
      pages: Math.ceil(count / perPage),
      current: Number(page),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const approvePost = async (req, res) => {
  console.log(req.params);
  try {
    await Post.findOneAndUpdate({ _id: req.params.id }, { approved: true });

    const posts = await Post.find({ approved: false });

    return res
      .status(200)
      .send({ message: "Successfully approved a post!", data: posts });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const sold = async (req, res) => {
  try {
    const { postId, buyerId, chatId } = req.body;
    console.log(req.body);

    const post = await Post.findById({ _id: postId });

    if (!post)
      return res.status(400).json({ message: "Failed to find the post!" });

    if (post.sold === false) {
      await Post.findByIdAndUpdate(
        { _id: postId },
        { sold: true, $set: { buyer: buyerId } },
        {
          new: true,
        }
      );

      const chat = await Chat.findOne({ _id: chatId })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate({
          path: "post",
          populate: { path: "buyer", select: "username email avatar_url" },
        })
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "username avatar_url email",
          });
          res.status(200).send(results);
        });
    } else {
      res.status(400).json({ message: "Already sold" });
    }
  } catch (error) {
    res.status(500).json({ message: "Interval error", error: error });
  }
};

const postController = {
  getApprovedPosts,
  createPost,
  updatePost,
  deletePost,
  getSpecificPost,
  searchPost,
  getInApprovalPosts,
  approvePost,
  sold,
  filterPost,
};

module.exports = postController;
