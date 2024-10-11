import { useEffect, useState } from "react";
import { Box, Card, Button, Typography } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import { InputBase } from "@mui/material";
import auth from "../../../helpers/Auth";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./ModalButton/components/ScrollableChat";
import { Link } from "react-router-dom";
import { sold } from "../api/ChatApi";
import { useNavigate } from "react-router-dom";
import RateModalButton from "./RateModalButton/RateModalButton";
import { debounce } from "lodash";

var socket, selectedChatCompare;
const ENDPOINT = `${process.env.REACT_APP_API}`;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // eslint-disable-next-line
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();

  const { selectedChat, messageNotification, setMessageNotification } =
    ChatState();

  useEffect(() => {
    const x = auth.isAuthenticated().user;
    socket = io(ENDPOINT, { transports: ["polling"] });
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
        `${process.env.REACT_APP_API}/api/message/${selectedChat._id}`,
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
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/message`,
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

  const soldPost = (postId, buyerId) => {
    let soldPost = new FormData();

    sold(
      { postId: postId, buyerId: buyerId },
      { t: JSON.parse(auth.isAuthenticated().token) },
      soldPost
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        navigate(0);
      }
    });
  };

  const debouncedSendMessage = debounce(sendMessage, 200);

  useEffect(() => {
    // !selectedChat|| selectedChat._id === selectedChatCompare?._id
    if (!selectedChat) {
      return;
    }
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
        if (!messageNotification.includes(newMessageReceived)) {
          setMessageNotification([newMessageReceived, ...messageNotification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
    return () => {
      socket.off("message received");
    };
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
            {selectedChat.post && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: "10px",
                }}
              >
                <Card
                  elevation={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {selectedChat.post.images.length > 0 && (
                    <div style={{ width: "100px", height: "100px" }}>
                      <img
                        alt=""
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px",
                          maxWidth: "100%",
                          height: "100%",
                          width: "auto",
                          display: "block",
                        }}
                        src={selectedChat.post.images[0]}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      padding: 10,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          color: "black",
                          textDecoration: "none",
                          "&:hover": {
                            color: "grey",
                          },
                          transition: "0.2s ease",
                        }}
                        component={Link}
                        to={`/post/${selectedChat.post._id}`}
                      >
                        {selectedChat.post.name}
                      </Typography>
                      <Typography sx={{ color: "red" }}>
                        {selectedChat.post.price}
                      </Typography>
                    </div>
                    <div>
                      {auth.isAuthenticated().user._id ===
                        selectedChat.post.author._id &&
                        (!selectedChat.post.sold ? (
                          <Button
                            variant="contained"
                            onClick={() =>
                              soldPost(
                                selectedChat.post._id,
                                selectedChat.users[0]?._id ===
                                  auth.isAuthenticated().user?._id
                                  ? selectedChat.users[1]._id
                                  : selectedChat.users[0]._id
                              )
                            }
                          >
                            Sold to this person
                          </Button>
                        ) : (
                          <Typography sx={{ color: "green" }}>
                            Already Sold
                          </Typography>
                        ))}
                      {auth.isAuthenticated().user._id ===
                        selectedChat.post.buyer?._id &&
                        (selectedChat.post.rated ? (
                          <Typography sx={{ color: "green" }}>
                            You already rated, you can see your rating at the
                            author's profile
                          </Typography>
                        ) : (
                          <RateModalButton chat={selectedChat} />
                        ))}
                    </div>
                  </div>
                </Card>
              </Box>
            )}
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
            onKeyDown={debouncedSendMessage}
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
