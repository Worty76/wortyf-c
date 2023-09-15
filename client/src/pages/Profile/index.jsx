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
} from "@mui/material";
import Topic from "../Discussion/components/Topic";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import auth from "../../helpers/auth";
import { changeAvatar } from "../Auth/authApi";

const useStyles = makeStyles({
  root: {
    padding: "1%",
    width: "90%",
    justifyContent: "center",
    margin: "0 auto",
  },
});

export default function Profile() {
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const [image, setImage] = useState();
  const params = useParams();

  const getUser = async (signal) => {
    try {
      await axios
        .get(`http://localhost:8000/api/user/${params.id}`, {
          cancelToken: signal,
        })
        .then((response) => {
          console.log(response)
          const data = response.data;

          setUser(data.user);
          setUsersPosts(data.usersPosts);
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

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log(file.path);

    let imageData = new FormData();
    imageData.append("image", e.target.files[0]);
    console.log(e.target.files[0]);

    file.preview = URL.createObjectURL(file);
    setImage(file);

    changeAvatar(
      {
        id: params.id,
      },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      imageData
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } 
    });
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getUser(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div style={{ display: "flex" }}>
        {/* Left */}
        <Box>
          <Card sx={{ maxWidth: "300px", minWidth: "250px" }}>
            <CardContent>
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <ListItemAvatar>
                  <Avatar
                    src={image ? image : `http://localhost:8000/${user.avatar_url}`}
                  />
                </ListItemAvatar>
              </ListItem>
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5">{user.username}</Typography>
              </ListItem>
              {auth.isAuthenticated() &&
              auth.isAuthenticated().user._id === user._id ? (
                <ListItem>
                  <form encType="multipart/form-data" method="POST">
                    <input
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={(e) => {
                        handleImage(e);
                      }}
                      type="file"
                      name="myFile"
                      id="icon-button-file"
                    />
                    <label htmlFor="icon-button-file">
                      <Button
                        sx={{ margin: "0 auto" }}
                        variant="contained"
                        component="span"
                      >
                        Change avatar
                      </Button>
                    </label>
                  </form>
                </ListItem>
              ) : null}
              <Divider />
              <List>
                <ListItemText
                  primary={
                    <Typography variant="h8">
                      Bio: {user.bio ? user.bio : "null"}
                    </Typography>
                  }
                />
                <Typography variant="h8">
                  Gender: {user.gender === true ? "Male" : "Female"}
                </Typography>
                <ListItemText
                  primary={
                    <Typography variant="h8">Age: {user.age}</Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="h8">
                      From: {user.from ? user.from : "null"}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography variant="h8">
                      Join at:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "null"}
                    </Typography>
                  }
                />
              </List>
              <ListItem sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h8">
                  Posts: {usersPosts && Object.keys(usersPosts).length}
                </Typography>
              </ListItem>
            </CardContent>
          </Card>
        </Box>
        {/* Middle */}
        <Box sx={{ width: "90%" }}>
          <div style={{ padding: "5%" }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="h5" color={"variant"}>
                    Here are your posts...
                  </Typography>
                }
              />
            </ListItem>
            {usersPosts && usersPosts.map((post) => (
              <div key={post._id} style={{ paddingBottom: "30px" }}>
                <Link
                  to={"/discussions/" + post._id}
                  style={{ textDecoration: "none" }}
                >
                  <Paper
                    className={classes.post}
                    sx={{ border: post.solved ? "1px #38E54D solid" : "none" }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="h6">{post.title}</Typography>
                          }
                          secondary={post.createdAt}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h8"
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
                                    variant="h8"
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
                                    variant="h8"
                                  >
                                    {Object.keys(post.comments).length} Comments
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <ListItem></ListItem>
                          </Box>
                        </Toolbar>
                      </Container>
                    </Box>
                  </Paper>
                </Link>
              </div>
            ))}
          </div>
        </Box>
        {/* Right */}
        <Box>
          <Card sx={{ maxWidth: "300px" }}>
            <CardContent>
              <ListItem sx={{ minWidth: "300px" }}>
                <Badge>
                  <ChatIcon />
                </Badge>
                <ListItemText
                  primary={
                    <Typography variant="h8" sx={{ paddingLeft: "10px" }}>
                      Recent comments today
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              <List>
      
              </List>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
}
