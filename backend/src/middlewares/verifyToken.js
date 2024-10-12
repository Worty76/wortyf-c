const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(400).json({ message: "Interval error server" });
    }
  }

  if (!token) {
    res.status(400).json({ message: "Token is invalid" });
  }
};

module.exports = verifyToken;
