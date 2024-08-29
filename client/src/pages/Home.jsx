import React, { useEffect, useState } from "react";
import Discussions from "./Discussion/index";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
});

export default function Home() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

  const getPosts = async (signal) => {
    try {
      await axios
        .get("http://localhost:8000/api/post", {
          cancelToken: signal,
        })
        .then((response) => {
          setPosts(response.data.data);
        })
        .catch(function(thrown) {
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
    getPosts(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Discussions posts={posts} setPosts={setPosts} />
    </div>
  );
}
