import React, { useEffect, useRef, useState } from "react";
import { Discussions } from "./Discussion";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useSocket } from "../context/SocketProvider";
import { ChatState } from "../context/ChatProvider";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
});

export const Home = () => {
  const { socket } = useSocket();
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const {
    messageNotification,
    setMessageNotification,
    setNotification,
    notification,
  } = ChatState();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const filters = params.get("filters");
  const sort = params.get("sort");
  const tag = params.get("tag");
  let searchParams = `${tag !== null ? `tag=${encodeURIComponent(tag)}` : ""}${
    filters !== null
      ? tag === null
        ? `filters=${filters}`
        : `&filters=${filters}`
      : ""
  }${
    sort !== null
      ? tag !== null || filters !== null
        ? `&sort=${sort}`
        : `sort=${sort}`
      : ""
  }`;

  const getPosts = async (signal) => {
    try {
      setLoading(true);
      await axios
        .get(
          `${process.env.REACT_APP_API}/api/post${
            searchParams ? `/home?${searchParams}` : ""
          }`,
          {
            cancelToken: signal,
          }
        )
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
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

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

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        if (!messageNotification.includes(newMessageReceived)) {
          console.log(newMessageReceived);
          setMessageNotification([newMessageReceived, ...messageNotification]);
        }
      });

      socket.on("notification", (noti) => {
        console.log(noti);
        setNotification([noti, ...notification]);
      });

      return () => {
        socket.off("message received");
        socket.off("notification");
      };
    }
  });

  return (
    <div className={classes.root}>
      <Discussions posts={posts} setPosts={setPosts} loading={loading} />
    </div>
  );
};
