import {
  Avatar,
  Badge,
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Toolbar,
  Typography,
  Modal,
  TextField,
  Input,
} from "@mui/material";
// eslint-disable-next-line
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import OutlinedFlagOutlinedIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { Link } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";
import { create } from "./discussionsApi";
import { VariantType, useSnackbar } from "notistack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Topic from "./components/Topic";
import auth from "../../helpers/auth";
// eslint-disable-next-line
import Crop169Icon from "@mui/icons-material/Crop169";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles({
  leftContainer: {
    flexGrow: 4,
    minWidth: "75%",
    maxWidth: "75%",
  },
  rightContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    display: "flex",
    justifyContent: "center",
  },
  post: {
    display: "flex",
  },
  TitleMultiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
  ContentMultiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },
  button: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#3c52b2",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    backgroundColor: "white",
    border: "1px solid #111",
    boxShadow: 24,
    p: 4,
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function Discussions({ posts, setPosts }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [option, setOption] = useState("");
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [values, setValues] = useState({
    title: "",
    description: "",
    content: "",
    error: "",
  });
  const [selectTopics, setSelectTopics] = useState([]);
  const [search, setSearch] = useState("");

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleOpen = () => {
    setOpen(!open);
    setValues({
      title: "",
      description: "",
      content: "",
      topic: [],
      error: "",
    });
  };

  const sortBy = (option) => {
    switch (option) {
      case "Trending":
        console.log("console option trending");
        setPosts(
          [...posts].sort(
            (a, b) => Object.keys(b.likes).length - Object.keys(a.likes).length
          )
        );
        break;
      case "Recent":
        console.log("console option recent");
        setPosts(
          [...posts].sort(
            (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
          )
        );
        break;
      case "Older":
        console.log("console option older");
        setPosts(
          [...posts].sort(
            (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
          )
        );
        break;
      default:
        break;
    }
  };

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully created a post", { variant });
  };

  const onSubmit = () => {
    let postData = new FormData();
    values.title && postData.append("title", values.title);
    values.description && postData.append("description", values.description);
    values.content && postData.append("content", values.content);
    selectTopics && postData.append("topic", selectTopics);

    create(
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      postData
    ).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.error.message });
      } else {
        // setPosts([...posts, JSON.parse(data)]);
        const postId = JSON.parse(data)._id;
        navigate(`/discussions/${postId}`);
        handleOpen();
        handleVariant("success");
      }
    });
  };

  const handleOption = (event: SelectChangeEvent) => {
    setOption(event.target.value);
    sortBy(event.target.value);
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`http://localhost:8000/api/topic`, {
          cancelToken: signal,
        })
        .then((response) => {
          setTopics(response.data.data);
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getTopics(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, []);

  const renderError = () => {
    return (
      <div
        style={{
          color: "red",
          fontSize: "15px",
          paddingTop: "10px",
          position: "absolute",
          width: "100%",
          textAlign: "center",
        }}
      >
        {values.error}
      </div>
    );
  };

  const handleSelectingOptions = (event) => {
    const {
      target: { value },
    } = event;
    setSelectTopics(typeof value === "string" ? value.split(",") : value);
  };

  const sortPosts = (posts) => {
    return posts.filter((post) => post.title.toLowerCase().includes(search));
  };

  return (
    <Paper sx={{ display: "flex" }} elevation={0}>
      {/* Left Container */}
      <Box className={classes.leftContainer}>
        {/* Toolbar */}
        <Toolbar disableGutters>
          {/* Left component */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <FormControl>
              <Select
                value={option}
                onChange={handleOption}
                displayEmpty
                sx={{ outline: "none" }}
                size="small"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value={"Trending"}>Trending</MenuItem>
                <MenuItem value={"Recent"}>Recent</MenuItem>
                <MenuItem value={"Older"}>Older</MenuItem>
              </Select>
            </FormControl>
            <SearchIcon sx={{ marginLeft: "10px" }} />
            <Input
              type={"search"}
              style={{ marginLeft: "10px" }}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name of the problem"
            />
          </Box>
          {/* Right component */}
          <Box sx={{ flexGrow: 0 }}>
            <ListItem>
              <Badge>
                <OutlinedFlagOutlinedIcon />
              </Badge>
              <ListItemText
                primary={
                  <Typography variant="h8">
                    Let's build a strong community
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        </Toolbar>
        <Divider />

        {/* Posts */}
        {sortPosts(posts).map((post) => (
          <div key={post._id} style={{ paddingBottom: "20px" }}>
            <Link
              to={"/discussions/" + post._id}
              style={{ textDecoration: "none" }}
            >
              <Paper
                className={classes.post}
                sx={{ border: post.solved ? "1px #38E54D solid" : "none" }}
              >
                <Box sx={{ flexGrow: 0, display: "flex" }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        alt={post.author.username}
                        src={
                          `http://localhost:8000/${post?.author?.avatar_url}`
                        }
                        sx={{ height: "70px", width: "70px" }}
                      />
                    </ListItemAvatar>
                  </ListItem>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          className={classes.TitleMultiLineEllipsis}
                        >
                          {post.title}
                        </Typography>
                      }
                      secondary={post.createdAt}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h8"
                          className={classes.ContentMultiLineEllipsis}
                        >
                          {post.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    {post.topic.map((topic, id) => (
                      <Topic topicId={topic} key={id} />
                    ))}
                  </ListItem>
                </Box>

                <Box
                  sx={{
                    flexGrow: 0,
                    alignItems: "center",
                    minWidth: "210px",
                    display: {
                      xs: "none",
                      md: "flex",
                    },
                  }}
                >
                  <div>
                    <ListItem>
                      {/* Show how many people are there in the comments */}
                      {/* <ListItemAvatar>
                        <TotalAvatars props={comments} />
                      </ListItemAvatar> */}
                    </ListItem>
                    <ListItem>
                      <Badge>
                        <ChatBubbleOutlineIcon />
                      </Badge>
                      <ListItemText
                        primary={
                          <Typography sx={{ paddingLeft: "5px" }} variant="h8">
                            {Object.keys(post.comments).length} Comments
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Badge>
                        <FavoriteBorderIcon />
                      </Badge>
                      <ListItemText
                        primary={
                          <Typography sx={{ paddingLeft: "5px" }} variant="h8">
                            {Object.keys(post.likes).length} Likes
                          </Typography>
                        }
                      />
                    </ListItem>
                  </div>
                </Box>
              </Paper>
            </Link>
          </div>
        ))}
      </Box>

      {/* Right Container */}
      <Box className={classes.rightContainer}>
        <div>
          <List>
            <ListItem>
              {auth.isAuthenticated().user ? (
                <Button
                  size="large"
                  className={classes.button}
                  sx={{ backgroundColor: "#3c52b2", color: "#fff" }}
                  onClick={handleOpen}
                >
                  Start a new discussion
                </Button>
              ) : (
                <Button
                  size="large"
                  className={classes.button}
                  sx={{
                    backgroundColor: "#3c52b2",
                    color: "#fff",
                    textAlign: "center",
                  }}
                  LinkComponent={Link}
                  to={"/signin"}
                >
                  Sign in to start a new discussion
                </Button>
              )}
            </ListItem>
          </List>
          {/* <ListItem>
            <Badge>
              <Crop169Icon sx={{ color: "#38E54D" }} />
            </Badge>
            <ListItemText primary={<Typography>: Solved posts</Typography>} />
          </ListItem> */}
          <Divider />
          <List>
            {topics.map((topic, id) => (
              <ListItem key={id}>
                <Badge>
                  <CircleIcon
                    sx={{ color: `${topic.color}` }}
                    fontSize="small"
                  />
                </Badge>
                <Typography sx={{ paddingLeft: "10px" }}>
                  {topic.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </Box>

      {/* Modals */}
      <Modal open={open} onClose={handleOpen}>
        <Box className={classes.modal}>
          <div style={{ width: "100%" }}>
            <List>
              <ListItem>
                <h3
                  style={{
                    textAlign: "center",
                    width: "100%",
                    fontWeight: "300",
                  }}
                >
                  There are many people are waiting for your new question
                </h3>
              </ListItem>
              <ListItem>
                <TextField
                  label="Title"
                  variant="outlined"
                  id="title"
                  onChange={handleChange("title")}
                  fullWidth
                />
              </ListItem>
              <ListItem>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  id="description"
                  onChange={handleChange("description")}
                />
              </ListItem>
              <ListItem>
                <TextField
                  fullWidth
                  label="Content"
                  variant="outlined"
                  id="content"
                  onChange={handleChange("content")}
                />
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Topics</InputLabel>
                  <Select
                    multiple
                    value={selectTopics}
                    onChange={handleSelectingOptions}
                    input={<OutlinedInput label="Topics" />}
                  >
                    {topics.map((topic, id) => (
                      <MenuItem key={id} value={topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
            </List>
            <Button
              variant="contained"
              onClick={onSubmit}
              sx={{ display: "flex", margin: "0 auto" }}
            >
              Submit
            </Button>
            {values.error ? renderError() : null}
          </div>
        </Box>
      </Modal>
    </Paper>
  );
}
