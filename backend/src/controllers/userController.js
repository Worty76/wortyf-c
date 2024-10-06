const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const Rating = require("../models/rating");
require("dotenv").config();

// Login
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Checking if the user is existed or not
    if (!user)
      return res.status(400).send({ message: "This user is not existed!" });

    const validPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // Checking if password is correct or not
    if (!validPassword)
      return res.status(400).send({ message: "This password is incorrect!" });

    // Create token for user
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.TOKEN /*{ expiresIn: new Date() + 9999 }*/
    );

    res
      .status(200)
      .send({ message: "Successfully login", token: token, data: user });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
    console.log(error);
  }
};

// Register
const register = async (req, res) => {
  try {
    const newEmail = await User.findOne({ email: req.body.email });
    // Checking if the email is existed or not
    if (newEmail)
      return res
        .status(400)
        .send({ message: "This email is already existed!" });

    const salt = await bcrypt.genSaltSync(10);

    // Hash password
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      from: req.body.from || null,
      bio: req.body.bio || null,
      role: "user",
    });

    // Create an user in MongoDB
    await user.save().then(() => {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.TOKEN /*{ expiresIn: new Date() + 9999 }*/
      );

      res.status(200).send({
        message: "Successfully added an user",
        data: user,
        token: token,
      });
    });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const getUsers = async (req, res) => {
  let users = await User.find();

  if (!users)
    return res.status(400).send({ message: "Could not get any user" });

  users = users.filter((user) => user._id.valueOf() !== req.user._id.valueOf());

  res.status(200).send({ message: "Successfully get users", data: users });
};

const getGuardians = async (req, res) => {
  const users = await User.find({ role: "guardian" });

  if (!users)
    return res.status(400).send({ message: "Could not get any user" });

  res.status(200).send({ message: "Successfully get users", data: users });
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).json({ message: "Could not get any user" });
  const posts = await Post.find({ "author._id": req.params.id }).populate(
    "topic"
  );
  const ratings = await Rating.find({ user_id: req.params.id }).populate(
    "author",
    "email username createdAt"
  );
  res.status(200).json({
    message: "Successfully get user",
    user: user,
    usersPosts: posts,
    ratings: ratings,
  });
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user)
      return res.status(400).send({ message: "Could not get any user" });

    await User.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Successfully deleted an user" });
  } catch (error) {
    res.status(500).send({ message: "Interval error", error: error });
  }
};

const changeAvatar = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) return res.status(400).send({ message: "Could not get any user" });

  fs.access("./uploads", (error) => {
    if (error) {
      fs.mkdirSync("./uploads");
    }
  });

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  const uploadFolder = path.join(__dirname, "public", "files");
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder;
  const body = await doSomethingWithNodeRequest(req);

  const timestamp = Date.now();
  const ref = `${timestamp}-${body.newFilename}.webp`;
  const buffer = fs.readFileSync(body.image._writeStream.path);
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./public/uploads/" + ref);

  user.avatar_url = ref;

  await user.save();

  await Post.updateMany(
    { "author._id": req.params.id },
    { $set: { "author.avatar_url": ref } }
  );

  await Comment.updateMany(
    { "author._id": req.params.id },
    { $set: { "author.avatar_url": ref } }
  );

  res
    .status(200)
    .json({ message: "Successfully changed avatar", avatar_url: ref });
};

const photo = (req, res, next) => {
  if (req.user) {
    res.set("Content-Type", req.params.id.contentType);
    return res.send(req.params.id.data);
  }
  next();
};

function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}

const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const changeRole = async (req, res) => {
  await User.findOneAndUpdate({ _id: req.params.id }, { role: req.body.role });

  return res.status(200).json({ message: "Successfully changed role" });
};

const userController = {
  login,
  register,
  getUsers,
  deleteUser,
  getUser,
  changeAvatar,
  photo,
  getGuardians,
  changeRole,
  searchUsers,
};

module.exports = userController;
