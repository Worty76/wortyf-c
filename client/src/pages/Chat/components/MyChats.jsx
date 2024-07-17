import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ListItemText,
} from "../../../../node_modules/@material-ui/core/index";
import { ChatState } from "../../../context/ChatProvider";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "../../../../node_modules/axios/index";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";

function MyChats({ fetchAgain }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      // console.log(user._id);
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/chat",
          config
        );
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
    // The below dependency was fetchAgain
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box sx={{ alignItems: "center", width: "100%" }}>
      <Box
        sx={{
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "lightblue",
        }}
      >
        My Chats
        <GroupChatModal />
      </Box>
      <Box sx={{ width: "100%", height: "100%" }}>
        {chats ? (
          <div style={{ padding: 10 }}>
            {chats.map((chat, id) => (
              <Box
                key={id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  backgroundColor: `${
                    selectedChat === chat ? "lightblue" : "lightgrey"
                  }`,
                  color: `${selectedChat === chat ? "while" : "black"}`,
                }}
              >
                <ListItemButton>
                  <ListItemText primary={chat.chatName} />
                </ListItemButton>
              </Box>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
