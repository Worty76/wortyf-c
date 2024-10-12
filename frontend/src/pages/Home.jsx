import React, { useEffect, useRef, useState } from "react";
import { Discussions } from "./Discussion";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
});

export const Home = () => {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);

  const getPosts = async (signal) => {
    try {
      setLoading(true);
      await axios
        .get(`${process.env.REACT_APP_API}/api/post`, {
          cancelToken: signal,
        })
        .then((response) => {
          if (isMounted.current) {
            setPosts(response.data.data);
          }
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (auth.isAuthenticated()) {
  //     socket.on("message received", (newMessageReceived) => {
  //       if (!messageNotification.includes(newMessageReceived)) {
  //         setMessageNotification([newMessageReceived, ...messageNotification]);
  //       }
  //     });

  //     return () => {
  //       socket.off("message received");
  //     };
  //   }
  // });

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    isMounted.current = true;

    getPosts(source.token);
    return () => {
      isMounted.current = false;
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Discussions posts={posts} setPosts={setPosts} loading={loading} />
    </div>
  );
};
