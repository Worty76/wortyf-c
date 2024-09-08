import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import { InputBase } from "@mui/material";
import auth from "../../../helpers/Auth";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./ModalButton/components/ScrollableChat";

var socket, selectedChatCompare;
const ENDPOINT = "http://localhost:8000";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // eslint-disable-next-line
  const [socketConnected, setSocketConnected] = useState(false);

  const { selectedChat, notification, setNotification } = ChatState();

  console.log(auth.isAuthenticated());
  useEffect(() => {
    const x = auth.isAuthenticated().user;
    socket = io(ENDPOINT);
    socket.emit("setup", x);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

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

        socket.emit("new message", data);
        setNewMessage("");
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

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <Box
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {selectedChat && selectedChat === selectedChatCompare ? (
        <>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div
              className="messages"
              style={{
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                padding: "10px",
                flex: 1,
              }}
            >
              <ScrollableChat messages={messages} />
            </div>
          </div>
          <InputBase
            style={{
              padding: "10px",
              border: "2px solid #007bff",
              borderRadius: "4px",
              margin: "10px",
              fontSize: "16px",
              "&:focus": {
                borderColor: "#0056b3",
                outline: "none",
              },
            }}
            placeholder="Enter a message.."
            id="my-input"
            aria-describedby="my-helper-text"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            onKeyDown={sendMessage}
          />
        </>
      ) : selectedChat === "" ? (
        <Box sx={{ padding: 2 }}>Select a group chat to chat</Box>
      ) : (
        <Box sx={{ padding: 2 }}>loading...</Box>
      )}
    </Box>
  );
}

export default SingleChat;
