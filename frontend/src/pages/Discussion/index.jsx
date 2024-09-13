import {
  Avatar,
  Badge,
  Button,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
// eslint-disable-next-line
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import OutlinedFlagOutlinedIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { Link } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Topic from "./components/Topic";
import auth from "../../helpers/Auth";
// eslint-disable-next-line
import Crop169Icon from "@mui/icons-material/Crop169";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

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

export default function Discussions({
  posts,
  setPosts,
  nPages,
  currentPage,
  setCurrentPage,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [option, setOption] = useState("");
  const [topics, setTopics] = useState([]);

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  console.log(posts);

  const handleOpen = () => {
    navigate("/home/create");
  };

  const sortBy = (option) => {
    switch (option) {
      case "Trending":
        console.log("console option popular");
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

  const searchPosts = async (key) => {
    await axios
      .get(`http://localhost:8000/api/post/search?text=${key}`)
      .then((res) => setPosts(res.data.data));
  };

  // eslint-disable-next-line
  const debounceSearchPosts = useCallback(
    debounce((nextValue) => searchPosts(nextValue), 1000),
    []
  );

  const handleSearchPosts = (event) => {
    let { value } = event.target;

    // Handle encoding special characters
    if (value.includes("&")) {
      value = value.replace("&", "%26");
    }

    debounceSearchPosts(value);
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
            <TextField
              type="search"
              label="Search posts"
              variant="outlined"
              size="small"
              onChange={handleSearchPosts}
              sx={{ marginLeft: "10px", width: "80%" }}
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
        {posts &&
          posts.map((post) => (
            <div key={post._id} style={{ paddingBottom: "20px" }}>
              <Link
                to={"/discussions/" + post._id}
                style={{ textDecoration: "none" }}
              >
                <Paper
                  className={classes.post}
                  sx={{
                    position: "relative",
                    // border: post.solved ? "1px #38E54D solid" : "none",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {post.solved && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#31d631",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Sold
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 0, display: "flex" }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          alt={post.author.username}
                          src={`http://localhost:8000/${post?.author?.avatar_url}`}
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
                            <Typography
                              sx={{ paddingLeft: "5px" }}
                              variant="h8"
                            >
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
                            <Typography
                              sx={{ paddingLeft: "5px" }}
                              variant="h8"
                            >
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
        {posts.length === 0 && <div>No posts found</div>}
        <div style={{ display: "flex" }}>
          <Button variant="contained" onClick={goToPrevPage}>
            Previous
          </Button>
          {pageNumbers.map((pgNumber) => (
            <div
              key={pgNumber}
              style={{ paddingLeft: "2px", paddingRight: "2px" }}
            >
              <Button
                style={{
                  backgroundColor:
                    currentPage === pgNumber ? "#24292F" : "lightgrey",
                  color: currentPage === pgNumber ? "white" : "",
                }}
                onClick={() => setCurrentPage(pgNumber)}
              >
                {pgNumber}
              </Button>
            </div>
          ))}
          <Button variant="contained" onClick={goToNextPage}>
            Next
          </Button>
        </div>
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
    </Paper>
  );
}
