const Topic = require("../models/topic");

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({});

    return res
      .status(200)
      .send({ message: "Successfully get topics", data: topics });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to get topics", error: error });
  }
};

const topicController = {
  getTopics,
};

module.exports = topicController;
