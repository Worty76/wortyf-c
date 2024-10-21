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

const getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { filters, tag, sort, name, page = 1 } = req.query;
    const perPage = 9;

    const topic = await Topic.findOne({ _id: id });
    if (!topic) {
      return res.status(400).send({ message: "Topic not found" });
    }

    let query = { approved: true, topic: topic._id };
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

      query.topic = { $all: [topic._id, ...topics] };
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
      posts: posts,
      topic: topic,
      pages: Math.ceil(count / perPage),
      current: Number(page),
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error.message });
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
