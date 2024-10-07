import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import auth from "../../../helpers/Auth";
import { changeAvatar } from "../../Auth/api/authApi";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { Topic } from "../../Discussion/components/Topic";
import { Stars } from "../components/Stars";

const useStyles = makeStyles({
  root: {
    padding: "20px",
    width: "90%",
    margin: "20px auto",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center the content horizontally
    marginBottom: "20px",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  post: {
    margin: "15px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
  },
  multiLineEllipsis: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    WebkitLineClamp: "3",
  },
  noPosts: {
    textAlign: "center",
    padding: "20px",
  },
});

export const Profile = () => {
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { setSelectedChat, chats, setChats } = ChatState();
  const [avgRatings, setAvgRatings] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  const getUser = async (signal) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/${params.id}`,
        {
          cancelToken: signal,
        }
      );
      const data = response.data;
      setUser(data.user);
      setUsersPosts(data.usersPosts);
      setRatings(data.ratings);
      setAvgRatings(data.avgRatings);
      console.log(data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    setImage(file);
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const response = await changeAvatar(
        { id: params.id },
        { t: JSON.parse(auth.isAuthenticated().token) },
        imageData
      );
      console.log(response);
      auth.updateAvatarUrl(JSON.parse(response));
      setUploadSuccess(true);
      window.location.reload(true);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const accessChat = async () => {
    const userId = user._id;
    console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:8000/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigate("/chat");
    } catch (error) {}
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getUser(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, [params.id]);

  return (
    <div className={classes.root}>
      <Snackbar
        open={uploadSuccess}
        autoHideDuration={6000}
        onClose={() => setUploadSuccess(false)}
        message="Avatar updated!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setUploadSuccess(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={!!uploadError}
        autoHideDuration={6000}
        onClose={() => setUploadError(null)}
        message={`Error: ${uploadError}`}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setUploadError(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box className={classes.avatarSection} sx={{ flex: 1 }}>
          <Card sx={{ maxWidth: "300px", minWidth: "250px" }}>
            <CardContent>
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <ListItemAvatar>
                  <Avatar
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : `http://localhost:8000/${user.avatar_url}`
                    }
                    className={classes.avatar}
                  />
                </ListItemAvatar>
              </ListItem>
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5">{user.username}</Typography>
              </ListItem>
              {auth.isAuthenticated() &&
                auth.isAuthenticated().user._id === user._id && (
                  <div className={classes.buttonWrapper}>
                    <form encType="multipart/form-data" method="POST">
                      <input
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImage}
                        type="file"
                        id="icon-button-file"
                      />
                      <label htmlFor="icon-button-file">
                        <Button variant="contained" component="span">
                          Change Avatar
                        </Button>
                      </label>
                    </form>
                    {uploading && (
                      <CircularProgress size={24} sx={{ marginLeft: 2 }} />
                    )}
                  </div>
                )}
              {auth.isAuthenticated() &&
                auth.isAuthenticated().user._id !== user._id && (
                  <div className={classes.buttonWrapper}>
                    <Button
                      variant="contained"
                      component="span"
                      onClick={accessChat}
                    >
                      Send Message
                    </Button>
                  </div>
                )}

              <Typography sx={{ textAlign: "center" }}>
                <Stars noOfStars={avgRatings} />
              </Typography>

              <List>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      Bio: {user.bio ? user.bio : "No bio available"}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      Gender: {user.gender === true ? "Male" : "Female"}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="body1">Age: {user.age}</Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      From: {user.from ? user.from : "Unknown"}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      Joined:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "N/A"}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      Posts: {usersPosts.length}
                    </Typography>
                  }
                />
              </List>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 3, padding: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Here are your posts...
          </Typography>
          {usersPosts.length === 0 ? (
            <Typography variant="body1" className={classes.noPosts}>
              No posts yet. Start contributing now!
            </Typography>
          ) : (
            usersPosts.map((post) => (
              <Link
                key={post._id}
                to={`/discussions/${post._id}`}
                style={{ textDecoration: "none" }}
              >
                <Paper className={classes.post}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ cursor: "pointer" }}>
                          {post.name}
                          {post.approved === false ? (
                            <span style={{ color: "red" }}> In approval</span>
                          ) : null}
                        </Typography>
                      }
                      secondary={new Date(post.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          className={classes.multiLineEllipsis}
                        >
                          {post.content}
                        </Typography>
                      }
                    />
                  </ListItem>
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
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <Container maxWidth="large">
                      <Toolbar disableGutters>
                        <Box sx={{ display: "flex", flexGrow: 1 }}>
                          <ListItem>
                            <Badge>
                              <FavoriteBorderIcon />
                            </Badge>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ paddingLeft: "5px" }}
                                  variant="body2"
                                >
                                  {Object.keys(post.likes).length} Likes
                                </Typography>
                              }
                            />
                            <Badge>
                              <ChatBubbleOutlineIcon />
                            </Badge>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ paddingLeft: "5px" }}
                                  variant="body2"
                                >
                                  {Object.keys(post.comments).length} Comments
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Box>
                      </Toolbar>
                    </Container>
                  </Box>
                </Paper>
              </Link>
            ))
          )}
        </Box>
        <Box sx={{ flex: 1, padding: 2 }}>
          {/* Posts management section */}
          {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id && (
              <Card sx={{ maxWidth: "300px" }}>
                <CardContent>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Manage posts
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                  <List>
                    <ListItem>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "grey" },
                          transition: "0.2s ease",
                        }}
                      >
                        Approved posts (
                        {
                          usersPosts.filter((post) => post.approved === true)
                            .length
                        }
                        )
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "grey" },
                          transition: "0.2s ease",
                        }}
                      >
                        Waiting for approval (
                        {
                          usersPosts.filter((post) => post.approved === false)
                            .length
                        }
                        )
                      </Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          {/* Rating section */}
          <Card sx={{ maxWidth: "300px", marginTop: 2 }}>
            <CardContent>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Ratings ({ratings.length})
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <List>
                {ratings &&
                  ratings.map((rating, id) => (
                    <Box
                      sx={{
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "10px",
                        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                      }}
                      key={id}
                    >
                      <ListItem>
                        <Typography
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "grey" },
                            transition: "0.2s ease",
                          }}
                        >
                          <Stars noOfStars={rating.noOfStars} />
                        </Typography>
                      </ListItem>
                      <Typography>
                        {rating.comment} from {rating.author.username}
                      </Typography>
                    </Box>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};
