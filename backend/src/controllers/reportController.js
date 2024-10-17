const Report = require("../models/report");

const read = async (req, res) => {
  try {
    const reports = await Report.find({}).populate("author").populate("postId");

    res
      .status(200)
      .json({ message: "Successfully get reports", data: reports });
  } catch (error) {
    res.status(500).json({ message: "Interval error server", error: error });
  }
};

const create = async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = req.params;
    console.log(req.params);
    console.log(req.body);

    const report = new Report({
      message: message,
      postId: id,
      author: req.user._id,
    });
    report.save();

    res
      .status(200)
      .json({ message: "Successfully created a report", data: report });
  } catch (error) {
    res.status(500).json({ message: "Interval error server", error: error });
  }
};
const reportController = { read, create };

module.exports = reportController;
