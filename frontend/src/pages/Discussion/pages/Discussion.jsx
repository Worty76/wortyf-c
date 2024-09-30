import React, { useEffect, useState, useRef } from "react";
// import CssBaseline from "@material-ui/core/CssBaseline";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Avatar,
  Toolbar,
  IconButton,
  Divider,
  TextField,
  Button,
  List,
  ListItemAvatar,
  Menu,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import {
  createComment,
  createLike,
  deleteLike,
  deletePost,
  updatePost,
} from "../api/DiscussionApi";
import { VariantType, useSnackbar } from "notistack";
import SingleComment from "../components/SingleComment";
import Topic from "../components/Topic";
import auth from "../../../helpers/Auth";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextEditor from "../components/TextEditor";
import { Markup } from "interweave";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
  responsiveTexts: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
  },
  sidebarContainer: {
    width: "20%",
  },
  postDetails: {
    marginTop: "30px",
  },
});

export const Discussion = () => {
  const classes = useStyles();
  // Initializations
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const timeoutRef = useRef(null);

  // Handle multiple clicks on Like/Unlike button
  const debouncedOnCreateLike = (event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onCreateLike();
    }, 300);
  };

  const debouncedOnDeleteLike = (event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onDeleteLike();
    }, 300);
  };

  // Handle open options
  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  // Handle editing post's information
  const [openEditing, setOpenEditing] = useState(false);

  const [valuesEditing, setValuesEditing] = useState({
    title: "",
    description: "",
    content: "",
  });

  // Handle comments
  const [text, setText] = useState("");

  const handleOpenEditing = () => {
    setOpenEditing(!openEditing);
  };

  // Fetching posts information from database
  const getPost = async (signal) => {
    try {
      await axios
        .get(`http://localhost:8000/api/post/${params.id}`, {
          cancelToken: signal,
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          setPost(data.post);
          setUser(data.author);
          setLikes(data.post.likes);
          const sortComments = []
            .concat(data.comments)
            .sort((a, b) => (a.correctAns > b.correctAns ? false : true));
          setComments(sortComments);
          setValuesEditing({
            title: data.post.title,
            description: data.post.description,
            content: data.post.content,
          });
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

  // Calling API after saving editing
  const onSaveEditing = () => {
    let post = new FormData();
    valuesEditing.title && post.append("title", valuesEditing.title);
    valuesEditing.description &&
      post.append("description", valuesEditing.description);
    valuesEditing.content && post.append("content", valuesEditing.content);

    updatePost(
      { id: params.id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      post
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        navigate(0);
        handleVariant("success");
      }
    });
  };

  // Fetch post
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getPost(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, []);

  // Check if users liked post or not
  const checkLiked = (likesProp) => {
    return (
      likesProp
        .map((e) => e.user_id)
        .indexOf(auth.isAuthenticated().user._id) !== -1
    );
  };

  // Handle changing data while editing post
  const handleChangeEditing = (name) => (event) => {
    setValuesEditing({ ...valuesEditing, [name]: event.target.value });
  };

  // Send notifications when users did an action
  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  // Update comments
  const updateComments = (comments) => {
    setComments(comments);
  };

  // Calling API
  const onCreateLike = () => {
    let like = new FormData();
    createLike(
      { id: params.id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      like
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        setLikes(JSON.parse(data));
      }
    });
  };

  const onDeleteLike = () => {
    deleteLike(
      { id: params.id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      }
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        setLikes(JSON.parse(data));
      }
    });
  };

  const onCreateComment = () => {
    let comment = new FormData();
    text && comment.append("text", text);

    createComment(
      { id: params.id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      comment
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        const comment = JSON.parse(data);
        setComments([comment, ...comments]);
        setText("");
        handleVariant("success");
      }
    });
  };

  const onDeletePost = () => {
    let deletePostEmit = new FormData();
    deletePost(
      { id: params.id },
      { t: JSON.parse(auth.isAuthenticated().token) },
      deletePostEmit
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        handleVariant("success");
        navigate("/home");
      }
    });
  };

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      <Paper className={classes.paper} elevation={3}>
        <Grid display="flex">
          {/* Left container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "240px",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <ListItem disablePadding>
              <ListItemIcon>
                <CheckCircleIcon
                  sx={{ color: post.solved ? "green" : "gray" }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{}}>
                    Sold
                  </Typography>
                }
              />
            </ListItem>
          </Box>

          {/* Right container */}
          <Box sx={{ width: "100%" }}>
            <div
              sx={{
                minWidth: "100%",
                height: "100%",
              }}
              className={classes.postDetails}
            >
              {/* Post's content */}
              {openEditing ? (
                <TextField
                  value={valuesEditing.title}
                  sx={{ width: "100%" }}
                  placeholder="Content"
                  variant="outlined"
                  multiline={true}
                  onChange={handleChangeEditing("title")}
                />
              ) : (
                <Typography variant="h5">{post.title}</Typography>
              )}
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={
                      user?.avatar_url
                        ? `http://localhost:8000/${user?.avatar_url}`
                        : ""
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ textDecoration: "none", color: "inherit" }}
                      component={Link}
                      to={`/profile/${user._id}`}
                    >
                      {user.username}
                    </Typography>
                  }
                  secondary={post.createdAt}
                />
                {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id === user._id ? (
                  <>
                    <IconButton onClick={handleOpenOptions}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleCloseOptions}
                    >
                      <MenuItem
                        onClick={(e) => {
                          handleOpenEditing();
                          handleCloseOptions();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          onDeletePost();
                          handleCloseOptions();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  ""
                )}
              </ListItem>
              {openEditing ? (
                <TextField
                  value={valuesEditing.content}
                  sx={{ width: "100%" }}
                  placeholder="Content"
                  variant="outlined"
                  multiline={true}
                  onChange={handleChangeEditing("content")}
                />
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <Typography>
                          <Markup content={post.content} />
                        </Typography>
                        <div
                          style={{
                            alignItems: "center",
                            flexFlow: "row wrap",
                            display: "flex",
                          }}
                        >
                          {post.images &&
                            post.images.map((image, id) => (
                              <img
                                key={id}
                                alt="images"
                                style={{
                                  width: "300px",
                                  minHeight: "100%",
                                  objectFit: "contain",
                                  padding: 2,
                                }}
                                src={`http://localhost:8000/${image}`}
                              />
                            ))}
                        </div>
                      </>
                    }
                  />
                </ListItem>
              )}

              <ListItem>
                {post.topic &&
                  post.topic.map((topic, id) => (
                    <Topic topicId={topic} key={id} />
                  ))}
              </ListItem>
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1 }}>
                  <List>
                    <ListItem>
                      {auth.isAuthenticated() &&
                      (likes !== null) &
                        (likes !== undefined) &
                        (Object.keys(likes).length > 0) ? (
                        checkLiked(likes) ? (
                          <IconButton onClick={debouncedOnDeleteLike}>
                            <FavoriteIcon sx={{ color: "#DC143C" }} />
                          </IconButton>
                        ) : (
                          <IconButton onClick={debouncedOnCreateLike}>
                            <FavoriteIcon />
                          </IconButton>
                        )
                      ) : (
                        ""
                      )}
                      {auth.isAuthenticated() &&
                      Object.keys(likes).length === 0 ? (
                        <IconButton onClick={debouncedOnCreateLike}>
                          <FavoriteIcon />
                        </IconButton>
                      ) : (
                        ""
                      )}
                      {!auth.isAuthenticated() ? (
                        <IconButton href="/signin">
                          <FavoriteIcon />
                        </IconButton>
                      ) : (
                        ""
                      )}

                      <ListItemText
                        primary={
                          Object.keys(likes).length +
                          `${
                            Object.keys(likes).length > 1 ? " likes" : " like"
                          }`
                        }
                      />
                      {openEditing ? (
                        <Button variant="contained" onClick={onSaveEditing}>
                          Save
                        </Button>
                      ) : null}
                    </ListItem>
                  </List>
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <ListItem>
                    <IconButton>
                      <ErrorOutlineIcon />
                    </IconButton>
                    <ListItemText primary="Report this topic" />
                  </ListItem>
                </Box>
              </Toolbar>

              <Typography>
                {Object.keys(comments).length}
                {Object.keys(comments).length <= 1 ? " Answer" : " Answers"}
              </Typography>
              <br />
              <Divider />

              {/* Comment section */}
              <List>
                <ListItem>
                  {/* <TextField
                    sx={{ width: "100%" }}
                    label={"Your answer"}
                    onChange={(event) => {
                      setText(event.target.value);
                    }}
                  /> */}
                  <div style={{ width: "100%" }}>
                    <TextEditor
                      setText={setText}
                      onCreateComment={onCreateComment}
                    />
                  </div>
                </ListItem>
              </List>
              {comments &&
                comments.map((comment) => (
                  <Box
                    key={comment._id}
                    sx={{
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      margin: "15px",
                    }}
                  >
                    <SingleComment
                      updateComments={updateComments}
                      comment={comment}
                      postId={params.id}
                      solved={post.solved}
                      authorId={user._id}
                    />
                  </Box>
                ))}
            </div>
          </Box>
        </Grid>
      </Paper>
    </div>
  );
};
