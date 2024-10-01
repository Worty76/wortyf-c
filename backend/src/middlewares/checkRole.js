const User = require("../models/user");

const checkRole = (roles) => async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });

  !roles.includes(user.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};

module.exports = checkRole;
