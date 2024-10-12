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
  createNotification,
  deleteLike,
  deletePost,
  updatePost,
} from "../api/DiscussionApi";
import { VariantType, useSnackbar } from "notistack";
import SingleComment from "../components/SingleComment";
import auth from "../../../helpers/Auth";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextEditor from "../components/TextEditor";
import { Markup } from "interweave";

import { Topic } from "../components/Topic";
import { ChatState } from "../../../context/ChatProvider";

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
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const editorRef = useRef(null);
  const open = Boolean(anchorEl);
  const timeoutRef = useRef(null);
  const { setSelectedChat, chats, setChats } = ChatState();

  // Handle multiple clicks on Like/Unlike button
  const debouncedOnCreateLike = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onCreateLike();
    }, 300);
  };

  const debouncedOnDeleteLike = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onDeleteLike();
    }, 300);
  };

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const [openEditing, setOpenEditing] = useState(false);

  const [valuesEditing, setValuesEditing] = useState({
    name: "",
    price: "",
    content: "",
  });

  const [text, setText] = useState("");

  const handleOpenEditing = () => {
    setOpenEditing(!openEditing);
  };

  const getPost = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/post/${params.id}`, {
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
            name: data.post.name,
            price: data.post.price,
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

  const onSaveEditing = () => {
    let post = new FormData();
    valuesEditing.name && post.append("name", valuesEditing.name);
    valuesEditing.price && post.append("price", valuesEditing.price);
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

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getPost(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, []);

  const checkLiked = (likesProp) => {
    console.log(likesProp);
    return (
      likesProp
        .map((e) => e.user_id)
        .indexOf(auth.isAuthenticated().user._id) !== -1
    );
  };

  const handleChangeEditing = (name) => (event) => {
    setValuesEditing({ ...valuesEditing, [name]: event.target.value });
  };

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  const updateComments = (comments) => {
    setComments(comments);
  };

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
        console.log(JSON.parse(data));
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
        console.log(JSON.parse(data));
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
        editorRef.current.setContent("");
      }
    });

    createNotification(
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      {
        recipientId: post.author._id,
        postId: post._id,
        redirectUrl: `/post/${post._id}`,
        type: "comment",
      }
    ).then((data) => {
      console.log(data);
      // if (data.stack) {
      //   console.log(data);
      // } else {
      // }
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

  const accessChat = async (userId, postId) => {
    console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/chat`,
        { userId, postId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigate(`/chat/${data._id}`);
    } catch (error) {}
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
                  sx={{ color: post.sold ? "#008000" : "gray" }}
                />
              </ListItemIcon>
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
                  value={valuesEditing.name}
                  sx={{ width: "100%" }}
                  placeholder="Content"
                  variant="outlined"
                  multiline={true}
                  onChange={handleChangeEditing("name")}
                />
              ) : (
                <ListItemText
                  primary={<Typography variant="h5">{post.name}</Typography>}
                  secondary={
                    <Typography sx={{ color: "red" }} variant="h8">
                      {post.price}
                    </Typography>
                  }
                />
              )}
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={user?.avatar_url ? user?.avatar_url : ""} />
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
                ) : null}
                {post &&
                  !post.sold &&
                  auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id !== user._id && (
                    <Button
                      variant="contained"
                      onClick={() => accessChat(user._id, post._id)}
                    >
                      Chat
                    </Button>
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
                        <Typography component="div">
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
                                  borderRadius: "10px",
                                  minHeight: "100%",
                                  objectFit: "contain",
                                  padding: 2,
                                }}
                                src={image}
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
                    <Topic
                      key={id}
                      name={topic.name}
                      color={topic.color}
                      id={id}
                    />
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
                        <IconButton href="/sign-in">
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
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <TextEditor setText={setText} editorRef={editorRef} />
                  </div>
                  <Button
                    sx={{ margin: 2 }}
                    variant="contained"
                    onClick={onCreateComment}
                  >
                    Send
                  </Button>
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
