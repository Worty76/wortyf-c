import React, { useEffect, useState } from "react";
import {
  Box,
  ListItemText,
  CircularProgress,
  Button,
  Typography,
  Drawer,
  Input,
} from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";
import SearchIcon from "@mui/icons-material/Search";
import UserListItem from "./ModalButton/components/UserListItem";
import { getSender, getSenderAvatar } from "../../../Logic/ChatLogics";
import {
  Avatar,
  ListItemAvatar,
} from "../../../../node_modules/@material-ui/core/index";

function MyChats({ fetchAgain }) {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
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
                  <ListItemText
                    primary={
                      !chat.isGroupChat
                        ? getSender(auth.isAuthenticated().user, chat.users)
                        : chat.chatName
                    }
                    secondary={
                      chat.latestMessage
                        ? chat.latestMessage.sender.username +
                          ": " +
                          chat.latestMessage.content
                        : ""
                    }
                  />
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
