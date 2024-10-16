import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Typography,
  ListItem,
  Badge,
  Box,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";
import { Markup } from "interweave";
import { Topic } from "../../Discussion/components/Topic";

const useStyles = makeStyles({
  root: {
    padding: "1%",
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
});

export const Tag = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [tag, setTag] = useState({});
  const [posts, setPosts] = useState([]);

  const getTag = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/topic/${id}`, {
          cancelToken: signal,
        })
        .then((response) => {
          console.log(response);
          setTag(response.data.topic);
          setPosts(response.data.posts);
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

    getTag(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <ListItem>
        <Badge>
          <CircleIcon sx={{ color: `${tag.color}` }} fontSize="medium" />
        </Badge>
        <Typography
          sx={{
            textDecoration: "none",
            color: "black",
            paddingLeft: "10px",
            cursor: "pointer",
            "&:hover": { color: "grey" },
            transition: "0.2s ease",
          }}
          variant="h6"
        >
          {tag.name} ({Object.keys(posts).length})
        </Typography>
      </ListItem>
      <Box>
        {posts &&
          posts.map((post) => (
            <div key={post._id} style={{ paddingBottom: "20px" }}>
              <Link to={"/post/" + post._id} style={{ textDecoration: "none" }}>
                <Paper
                  className={classes.post}
                  sx={{
                    position: "relative",

                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {post.sold && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#008000",
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
                          src={post?.author?.avatar_url}
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
                            {post.name}
                          </Typography>
                        }
                        secondary={post.createdAt}
                      />
                    </ListItem>
                    <ListItem>
                      <Typography
                        variant="h8"
                        className={classes.ContentMultiLineEllipsis}
                        component="div"
                        sx={{ textDecoration: "none" }}
                      >
                        <Markup content={post.content} />
                      </Typography>
                    </ListItem>
                    <ListItem>
                      {post.topic.map((topic, id) => (
                        <Topic
                          key={id}
                          name={topic.name}
                          color={topic.color}
                          id={id}
                        />
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
                    <div style={{ width: "150px", height: "150px" }}>
                      <img
                        alt=""
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px",
                          maxWidth: "100%",
                          height: "100%",
                          width: "auto",
                          display: "block",
                          margin: "0 auto",
                        }}
                        src={post.images[0]}
                      />
                    </div>
                  </Box>
                </Paper>
              </Link>
            </div>
          ))}
      </Box>
    </div>
  );
};
