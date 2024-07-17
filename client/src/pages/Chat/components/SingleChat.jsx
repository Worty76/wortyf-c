import { useEffect, useState } from "react";
import { Box } from "../../../../node_modules/@material-ui/core/index";
import { ChatState } from "../../../context/ChatProvider";
import auth from "../../../helpers/Auth";
import axios from "../../../../node_modules/axios/index";

var socket, selectedChatCompare;

function SingleChat() {
  const user = auth.isAuthenticated();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  console.log(selectedChat);
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
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    console.log(messages);

    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat && selectedChat === selectedChatCompare ? (
        <>
          {" "}
          {messages ? (
            messages.map((message, id) => (
              <Box sx={{ padding: 10 }} key={id}>
                {message.content} from {message.sender.email}
              </Box>
            ))
          ) : (
            <></>
          )}{" "}
        </>
      ) : selectedChat === "" ? (
        <Box sx={{ padding: 10 }}>Select a group chat to chat</Box>
      ) : (
        <>
          <Box sx={{ padding: 10 }}>loading...</Box>
        </>
      )}
    </>
  );
}

export default SingleChat;
