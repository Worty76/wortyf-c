import React, { useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedPosts =
    posts && posts.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(posts.length / recordsPerPage);

  const getPosts = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/post`, {
          cancelToken: signal,
        })
        .then((response) => {
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
      <Discussions
        posts={paginatedPosts}
        setPosts={setPosts}
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
