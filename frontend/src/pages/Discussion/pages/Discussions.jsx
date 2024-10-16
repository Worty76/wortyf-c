import {
  Avatar,
  Badge,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
// eslint-disable-next-line
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import OutlinedFlagOutlinedIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";
import auth from "../../../helpers/Auth";
// eslint-disable-next-line
import Crop169Icon from "@mui/icons-material/Crop169";
import { useNavigate } from "react-router-dom";
// import SearchIcon from "@mui/icons-material/Search";
import { Topic } from "../components/Topic";
import { Markup } from "interweave";
import FilterOptions from "../components/FilterOptions";
import FilterListIcon from "@mui/icons-material/FilterList";
// import { useMemo } from "react";
import Pagination from "../components/Pagination";

const useStyles = makeStyles({
  leftContainer: {
    flexGrow: 4,
    minWidth: "75%",
    maxWidth: "75%",
  },
  rightContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    display: "flex",
    justifyContent: "center",
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
  button: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#3c52b2",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    backgroundColor: "white",
    border: "1px solid #111",
    boxShadow: 24,
    p: 4,
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const Discussions = ({
  posts,
  setPosts,
  loading,
  pageNumbers,
  currentPage,
  pages,
  setCurrentPage,
  setPageNumbers,
  handlePageChange,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  // const [searchInput, setSearchInput] = useState("");
  // const [clickedTags, setClickedTags] = useState([]);

  const handleOpen = () => {
    navigate("/home/create");
  };

  const handleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/topic`, {
          cancelToken: signal,
        })
        .then((response) => {
          setTopics(response.data.data);
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

  // const searchPosts = async (key) => {
  //   await axios
  //     .get(
  //       `${process.env.REACT_APP_API}/api/post/search?text=${encodeURIComponent(
  //         key
  //       )}`
  //     )
  //     .then((res) => setPosts(res.data.data));
  // };

  // const getTagFromUrl = useCallback(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const tag = params.get("tag");
  //   let newTag;
  //   if (tag) {
  //     newTag = tag.split(",");
  //   }
  //   return tag ? newTag.map((tag) => `[${tag.trim()}]`).join("") : null;
  //   // eslint-disable-next-line
  // }, [window.location.search]);

  // useEffect(() => {
  //   const urlTag = getTagFromUrl();
  //   if (urlTag && !clickedTags.includes(urlTag)) {
  //     setClickedTags([urlTag]);
  //   }
  //   // eslint-disable-next-line
  // }, [getTagFromUrl]);

  // const combinedSearchValue = useMemo(() => {
  //   const tagsString = clickedTags.join("");
  //   return tagsString + searchInput;
  // }, [clickedTags, searchInput]);

  // const handleSearchPosts = (event) => {
  //   if (event.target) {
  //     setSearchInput(event.target.value);
  //   } else {
  //     const value = `[${event}]`;
  //     setClickedTags((prevTags) => {
  //       if (prevTags.includes(value)) {
  //         return prevTags.filter((tag) => tag !== value);
  //       } else {
  //         return [...prevTags, value];
  //       }
  //     });
  //   }
  // };

  // const handleInputChange = (event) => {
  //   const inputValue = event.target.value;
  //   const tagsString = clickedTags.join("");

  //   if (inputValue.startsWith(tagsString)) {
  //     setSearchInput(inputValue.slice(tagsString.length));
  //   } else {
  //     setClickedTags([]);
  //     setSearchInput(inputValue);
  //   }
  // };

  // useEffect(() => {
  //   if (fireRef.current) {
  //     if (combinedSearchValue || combinedSearchValue === "") {
  //       const debounceTimer = setTimeout(() => {
  //         searchPosts(combinedSearchValue);
  //       }, 300);

  //       return () => clearTimeout(debounceTimer);
  //     }
  //   }

  //   fireRef.current = true;
  //   // eslint-disable-next-line
  // }, [combinedSearchValue]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getTopics(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Paper sx={{ display: "flex" }} elevation={0}>
      <Box className={classes.leftContainer}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleFilter}
              sx={{ alignItems: "center" }}
            >
              <FilterListIcon />
              Filter
            </Button>
            {/* <SearchIcon sx={{ marginLeft: "10px" }} />
            <TextField
              type="search"
              label="Search posts with name or tags... e.g. [Electronics] post name..."
              variant="outlined"
              size="small"
              value={combinedSearchValue}
              onChange={handleInputChange}
              sx={{ marginLeft: "10px", width: "80%" }}
            /> */}
            {/* <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{ pointerEvents: "none" }}
            >
              <Box p={2} maxWidth={300}>
                <Typography variant="h8">Search Tips:</Typography>
                <Typography variant="body2">
                  - Use [tag] to search within tags.
                  <br />
                  - Use "exact phrase" for specific terms.
                  <br />
                  - Search by user with user:1234.
                  <br />- Use score:3 to find posts with 3+ votes.
                </Typography>
              </Box>
            </Popover> */}
          </Box>
          {/* Right component */}
          <Box sx={{ flexGrow: 0 }}>
            <ListItem>
              <Badge>
                <OutlinedFlagOutlinedIcon />
              </Badge>
              <ListItemText
                primary={
                  <Typography variant="h8">
                    Let's build a strong community
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        </Toolbar>
        <Divider />
        {/* Posts */}
        {openFilter && (
          <FilterOptions
            open={openFilter}
            setPosts={setPosts}
            setCurrentPage={setCurrentPage}
            setPageNumbers={setPageNumbers}
          />
        )}
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
        {posts.length === 0 &&
          (loading ? (
            <div>
              <CircularProgress />
            </div>
          ) : (
            " "
          ))}
        <div style={{ display: "flex" }}>
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={pageNumbers}
          />
        </div>
      </Box>

      {/* Right Container */}
      <Box className={classes.rightContainer}>
        <div>
          <List>
            <ListItem>
              {auth.isAuthenticated().user ? (
                <Button
                  size="large"
                  className={classes.button}
                  sx={{ backgroundColor: "#3c52b2", color: "#fff" }}
                  onClick={handleOpen}
                >
                  Create a new post
                </Button>
              ) : (
                <Button
                  size="large"
                  className={classes.button}
                  sx={{
                    backgroundColor: "#3c52b2",
                    color: "#fff",
                    textAlign: "center",
                  }}
                  LinkComponent={Link}
                  to={"/sign-in"}
                >
                  Sign in to create a post
                </Button>
              )}
            </ListItem>
          </List>
          <Divider />
          <List>
            {topics &&
              topics.map((topic, id) => (
                <ListItem key={id}>
                  <Badge>
                    <CircleIcon
                      sx={{ color: `${topic.color}` }}
                      fontSize="small"
                    />
                  </Badge>
                  <Typography
                    onClick={() => {
                      navigate(`/tag/${topic._id}`);
                    }}
                    sx={{
                      textDecoration: "none",
                      color: "black",
                      paddingLeft: "10px",
                      cursor: "pointer",
                      "&:hover": { color: "grey" },
                      transition: "0.2s ease",
                    }}
                  >
                    {topic.name}
                  </Typography>
                </ListItem>
              ))}
            <ListItem>
              <Badge>
                <CircleIcon sx={{ color: "grey" }} fontSize="small" />
              </Badge>
              <Typography
                sx={{
                  paddingLeft: "10px",
                  cursor: "pointer",
                  "&:hover": { color: "grey" },
                  transition: "0.2s ease",
                  textDecoration: "none",
                  color: "black"
                }}
                component={Link}
                to="/tags"
              >
                Others
              </Typography>
            </ListItem>
          </List>
        </div>
      </Box>
    </Paper>
  );
};
