const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

// Routers
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const topicRouter = require("./routes/topicRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");

// PORT
const PORT = process.env.PORT;

// Connection Config
try {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to MongoDB"));
} catch (error) {
  console.error("Failed to connect to mongoDB");
}

// Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Configurations for "Static-files"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./uploads"));
app.use(express.static(`${__dirname}/public`));

// End-points
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/topic", topicRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});
