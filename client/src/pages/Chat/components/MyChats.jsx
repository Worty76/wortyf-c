import React, { useEffect, useState } from "react";
import { Box, ListItemText, CircularProgress } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";

function MyChats({ fetchAgain }) {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(true);

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
        <GroupChatModal />
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
                <ListItemText primary={chat.chatName} />
              </ListItemButton>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: "center", padding: 2 }}>No Chats Available</Box>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
