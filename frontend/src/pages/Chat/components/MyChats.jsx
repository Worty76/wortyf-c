import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  ListItemText,
  CircularProgress,
  Button,
  Typography,
  Drawer,
  Input,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";
import SearchIcon from "@mui/icons-material/Search";
import UserListItem from "./ModalButton/components/UserListItem";
import { getSender, getSenderAvatar } from "../../../logic/ChatLogics";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
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

function MyChats({ fetchAgain }) {
  const { chatId } = useParams();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [hasCalledEffect, setHasCalledEffect] = useState(false);
  const isMounted = useRef(true);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {}
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {}
  };

  const fetchChats = async (source) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: source.token,
      };
      await axios
        .get(`${process.env.REACT_APP_API}/api/chat`, config)
        .then((response) => {
          console.log(response);
          if (isMounted.current) {
            setChats(response.data);
          }
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });

      if (isMounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    isMounted.current = true;

    fetchChats(source);
    return () => {
      isMounted.current = false;
      setSelectedChat("");
      source.cancel("Component unmounted, cancelling axios requests");
    };
    // eslint-disable-next-line
  }, [fetchAgain]);

  useEffect(() => {
    if (!chats) return;
    if (!hasCalledEffect) {
      if (chats && chatId) {
        const chatExists = chats.find((chat) => chat._id === chatId);
        if (chatExists) {
          setSelectedChat(chatExists);
        } else {
          console.log("Chat ID not found in fetched chats");
        }
      }

      setHasCalledEffect(true);
    }
    // eslint-disable-next-line
  }, [chatId, chats, hasCalledEffect, setSelectedChat]);

  return (
    <>
      <Box
        sx={{
          width: "30%",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          My Chats
          <div style={{ display: "flex" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: 1 }}
              onClick={toggleDrawer(true)}
              startIcon={<SearchIcon />}
            >
              Search User
            </Button>
            {auth.isAuthenticated().user.role === "guardian" && (
              <>
                <GroupChatModal />
              </>
            )}
          </div>
        </Box>
        <Box sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <CircularProgress />
            </Box>
          ) : chats?.length > 0 ? (
            chats.map((chat, id) => (
              <Box
                key={id}
                onClick={() => {
                  setSelectedChat(chat);
                  navigate(`/chat/${chat._id}`);
                }}
                sx={{
                  backgroundColor: `${
                    selectedChat._id === chat._id ? "#e0f7fa" : "#ffffff"
                  }`,
                  color: `${
                    selectedChat._id === chat._id ? "#00796b" : "#000000"
                  }`,
                  borderRadius: "4px",
                  marginBottom: "1px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#f1f8e9",
                  },
                }}
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        !chat.isGroupChat
                          ? getSenderAvatar(
                              auth.isAuthenticated().user,
                              chat.users
                            )
                          : chat.chatName
                      }
                    />
                  </ListItemAvatar>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={
                        !chat.isGroupChat
                          ? getSender(auth.isAuthenticated().user, chat.users)
                          : chat.chatName
                      }
                      secondary={
                        <Typography
                          className={classes.TitleMultiLineEllipsis}
                          sx={{ fontSize: "15px", display: "block" }}
                        >
                          {chat.post?.name}
                          <span>
                            {chat.latestMessage
                              ? chat.latestMessage?.sender?.username +
                                ": " +
                                chat.latestMessage?.content
                              : ""}
                          </span>
                        </Typography>
                      }
                    />
                    {chat.post?.images && (
                      <div
                        style={{
                          height: "80px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
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
                          src={chat.post?.images[0]}
                        />
                      </div>
                    )}
                  </div>
                </ListItemButton>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", padding: 2 }}>
              No Chats Available
            </Box>
          )}
        </Box>
      </Box>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 350 }}>
          {" "}
          {/* This sets the width of the drawer */}
          <Box sx={{ borderBottom: "1px solid", padding: 2 }}>
            <Typography variant="h6">Search Users</Typography>
          </Box>
          <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", pb: 2 }}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ marginRight: 2 }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <CircularProgress />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default MyChats;
