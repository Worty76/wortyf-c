const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const multer = require("multer");

require("dotenv").config();

// Routers
const userRouter = require("./src/routes/userRouter");
const postRouter = require("./src/routes/postRouter");
const topicRouter = require("./src/routes/topicRouter");
const chatRouter = require("./src/routes/chatRouter");
const messageRouter = require("./src/routes/messageRouter");
const ratingRouter = require("./src/routes/ratingRouter");

// PORT
const PORT = process.env.PORT;

try {
  const start = new Date();
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      const now = new Date();
      console.log(
        "Successfully connected to MongoDB after",
        now.getTime() - start.getTime(),
        "ms"
      );
    });
} catch (error) {
  console.error("Failed to connect to mongoDB");
}

// Config
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"],
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Configurations for "Static-files"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./public/uploads"));
app.use(express.static(`${__dirname}/public/uploads`));

// End-points
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/topic", topicRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);
app.use("/api/rating", ratingRouter);

app.use("/", (req, res) => {
  res.send("Hello to WortyF-c project's backend");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.API,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["polling"],
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    console.log(newMessageReceived);
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
