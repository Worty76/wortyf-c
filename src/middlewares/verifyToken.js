const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

module.exports = async function (req, res, next) {
  const token = req.header("auth-header");

  if (!token) return res.status(401).send("Access Denied!");

  try {
    const verified = jwt.verify(token, process.env.TOKEN);
    req.user = verified;
    const user = await User.findById({ _id: req.user.id });

    if (!user) return res.status(401).send("Access Denied!");

    console.log(req.user);
    console.log(new Date().toUTCString());

    return next();
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
};
