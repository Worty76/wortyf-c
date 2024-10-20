const Topic = require("../models/topic");
const Post = require("../models/post");

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({}).limit(6);

    return res
      .status(200)
      .send({ message: "Successfully get topics", data: topics });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error });
  }
};

const getAllTopics = async (req, res) => {
  try {
    let perPage = 15;
    let page = Number(req.query.page) || 1;

    const topics = await Topic.find({})
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
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error });
  }
};

const getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findOne({ _id: id });
    const posts = await Post.find({ topic: { $in: id } }).populate("topic");

    return res
      .status(200)
      .send({ message: "Successfully get topics", topic: topic, posts: posts });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error });
  }
};

const create = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Both value must be provided!" });
  }

  const topic = await Topic.findOne({ name: name });

  if (topic) {
    return res
      .status(400)
      .send({ message: "This topic name is already exist" });
  }

  const newTopic = new Topic({
    name: name,
    description: description,
  });
  newTopic.save();

  try {
    return res
      .status(200)
      .send({ message: "Successfully created topic", data: newTopic });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to create topic", error: error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Both value must be provided!" });
  }

  const topic = await Topic.findOne({ _id: id });

  if (!topic) {
    return res.status(400).send({ message: "This topic name is not exist" });
  }

  const newTopic = await Topic.findOneAndUpdate(
    { _id: id },
    { $set: { name: name, description: description } },
    { new: true }
  );

  try {
    return res
      .status(200)
      .send({ message: "Successfully updated topic", data: newTopic });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to update topic", error: error });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const topic = await Topic.findByIdAndDelete({ _id: id });

  try {
    return res
      .status(200)
      .send({ message: "Successfully updated topic", data: topic });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to update topic", error: error });
  }
};

const searchTopic = async (req, res) => {
  try {
    const { search } = req.query;
    const topic = await Topic.findOne({ _id: id });
    const posts = await Post.find({ topic: { $in: id } }).populate("topic");

    return res
      .status(200)
      .send({ message: "Successfully get topics", topic: topic, posts: posts });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error });
  }
};

const topicController = {
  getTopics,
  getAllTopics,
  getTopic,
  create,
  update,
  remove,
};

module.exports = topicController;
