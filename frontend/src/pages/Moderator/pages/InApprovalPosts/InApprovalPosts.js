import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { VariantType, useSnackbar } from "notistack";
import auth from "../../../../helpers/Auth";
import { approve } from "../../api/moderatorApi";
import { Markup } from "interweave";

const useStyles = makeStyles({
  root: {
    padding: "1%",
    width: "95%",
    margin: "0 auto",
  },
});

export const InApprovalPosts = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  const getPosts = async (signal) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      await axios
        .get(
          `${process.env.REACT_APP_API}/api/post/moderator/in-approval-posts`,
          config,
          {
            cancelToken: signal,
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setPosts(response.data.data);
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

  const handleApprovePost = (postId) => {
    let approvePost = new FormData();

    approve(
      { postId: postId },
      { t: JSON.parse(auth.isAuthenticated().token) },
      approvePost
    ).then((data) => {
      if (data.stack) {
      } else {
        handleVariant("success");
        setPosts(data);
      }
    });
  };

  // const handleRejectPost = (postId) => {
  //   let rejectPost = new FormData();

  //   reject(
  //     { postId: postId },
  //     { t: JSON.parse(auth.isAuthenticated().token) },
  //     rejectPost
  //   ).then((data) => {
  //     if (data.stack) {
  //     } else {
  //       handleVariant("success");
  //       setPosts(data);
  //     }
  //   });
  // };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getPosts(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} md={6}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{post.price}</Typography>
                    <Typography variant="body2" component="div">
                      <Markup content={post.content} />
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Author: {post.author.username}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  {post.images.map((image, id) => (
                    <img
                      alt=""
                      style={{ width: 200, padding: 2 }}
                      key={id}
                      src={`${process.env.REACT_APP_API}/${image}`}
                    />
                  ))}
                </Grid>
                <List sx={{ display: "flex" }}>
                  <div style={{ padding: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprovePost(post._id)}
                    >
                      Approve
                    </Button>
                  </div>
                  {/* <div style={{ padding: 2 }}>
                    <Button variant="contained" color="error">
                      Reject
                    </Button>
                  </div> */}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {posts.length === 0 && <div>No posts found</div>}
      </Grid>
    </div>
  );
};
