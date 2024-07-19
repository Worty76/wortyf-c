import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import InputBase from "@material-ui/core/InputBase";
import auth from "../../../helpers/Auth";
import axios from "axios";
import ScrollableChat from "./ModalButton/components/ScrollableChat";

var socket, selectedChatCompare;

function SingleChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { selectedChat } = ChatState();

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle sending message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        console.log(newMessage, selectedChat);
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:8000/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        // socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;

    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        {selectedChat && selectedChat === selectedChatCompare ? (
          <>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                overflowY: "hidden",
              }}
            >
              <div
                className="messages"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
              <InputBase
                sx={{ backgroundColor: "lightblue" }}
                placeholder="Enter a message.."
                id="my-input"
                aria-describedby="my-helper-text"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                onKeyDown={sendMessage}
              />
            </Box>
          </>
        ) : selectedChat === "" ? (
          <Box sx={{ padding: 2 }}>Select a group chat to chat</Box>
        ) : (
          <>
            <Box sx={{ padding: 2 }}>loading...</Box>
          </>
        )}
      </Box>
    </>
  );
}

export default SingleChat;
