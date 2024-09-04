import React, { useEffect } from "react";
import { Box, ListItemText } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";

function MyChats({ fetchAgain }) {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    const fetchChats = async () => {
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
        // console.log(data);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box sx={{ alignItems: "center", width: "30%", border: "1px solid black", borderRadius: "0px 5px 5px 0px"}}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <GroupChatModal />
      </Box>
      <Box sx={{ width: "100%" }}>
        {chats ? (
          <div style={{ padding: 2 }}>
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
