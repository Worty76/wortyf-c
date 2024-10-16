import React, { useEffect, useRef, useState } from "react";
import { Discussions } from "./Discussion";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useSocket } from "../context/SocketProvider";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
});

export const Home = () => {
  const { socket } = useSocket();
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [pageNumbers, setPageNumbers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const {
    messageNotification,
    setMessageNotification,
    setNotification,
    notification,
  } = ChatState();
  const navigate = useNavigate();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const filters = params.get("filters");
  const sort = params.get("sort");
  const tag = params.get("tag");
  const name = params.get("name");
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
  }${
    name !== null
      ? tag !== "" || filters !== undefined || sort !== undefined
        ? `&name=${encodeURIComponent(name)}`
        : `name=${encodeURIComponent(name)}`
      : ``
  }`;

  const getPosts = async (signal) => {
    try {
      setLoading(true);
      const pageParam = currentPage ? `&page=${currentPage}` : "";
      await axios
        .get(
          `${process.env.REACT_APP_API}/api/post/home?${searchParams}${pageParam}`,
          {
            cancelToken: signal,
          }
        )
        .then((response) => {
          console.log(response);
          if (isMounted.current) {
            setPosts(response.data.data);
            setPageNumbers(response.data.pages);
            setCurrentPage(response.data.current);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate({
      pathname: "/home",
      search: `?page=${newPage}${searchParams ? `&${searchParams}` : ""}`,
    });
  };

  useEffect(() => {
    const pageFromUrl = params.get("page");
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    isMounted.current = true;

    getPosts(source.token);
    return () => {
      isMounted.current = false;
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
      <Discussions
        posts={posts}
        setPosts={setPosts}
        loading={loading}
        handlePageChange={handlePageChange}
        pageNumbers={pageNumbers}
        currentPage={currentPage}
        setPageNumbers={setPageNumbers}
        setCurrentPage={setCurrentPage}
        pages={pageNumbers}
      />
    </div>
  );
};
