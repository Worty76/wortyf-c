import React, { useEffect, useState } from "react";
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
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);

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
        `http://localhost:8000/api/user?search=${search}`,
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
        `http://localhost:8000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/chat",
          config
        );
        setChats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

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
            {auth.isAuthenticated().user.role === "guardian" && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 1 }}
                  onClick={toggleDrawer(true)}
                  startIcon={<SearchIcon />}
                >
                  Search User
                </Button>
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
          ) : chats.length > 0 ? (
            chats.map((chat, id) => (
              <Box
                key={id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  backgroundColor: `${
                    selectedChat === chat ? "#e0f7fa" : "#ffffff"
                  }`,
                  color: `${selectedChat === chat ? "#00796b" : "#000000"}`,
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
                          ? `http://localhost:8000/${getSenderAvatar(
                              auth.isAuthenticated().user,
                              chat.users
                            )}`
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
                        <div>
                          <Typography
                            className={classes.TitleMultiLineEllipsis}
                            sx={{ fontSize: "15px", display: "block" }}
                          >
                            {chat.post?.title}
                          </Typography>
                          <Typography
                            className={classes.TitleMultiLineEllipsis}
                            sx={{ fontSize: "15px", display: "block" }}
                          >
                            {chat.latestMessage
                              ? chat.latestMessage?.sender?.username +
                                ": " +
                                chat.latestMessage?.content
                              : ""}
                          </Typography>
                        </div>
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
                          src={`http://localhost:8000/${chat.post?.images[0]}`}
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
