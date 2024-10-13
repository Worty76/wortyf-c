import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Badge,
} from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";
import { InputBase } from "@mui/material";
import auth from "../../../helpers/Auth";
import axios from "axios";
import ScrollableChat from "./ModalButton/components/ScrollableChat";
import { Link } from "react-router-dom";
import { sold } from "../api/ChatApi";
import { useNavigate } from "react-router-dom";
import RateModalButton from "./RateModalButton/RateModalButton";
import { debounce } from "lodash";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSocket } from "../../../context/SocketProvider";

var selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [uploading, setUploading] = useState(false);

  const { selectedChat, messageNotification, setMessageNotification } =
    ChatState();

  // Fetch messages
  const fetchMessages = async (source) => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: source.token,
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      console.log(selectedChat);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle sending message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      const contentData = new FormData();
      contentData.append("chatId", selectedChat._id);
      contentData.append("content", newMessage);

      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
          },
        };
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/message`,
          contentData,
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

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);
    imageData.append("chatId", selectedChat._id);

    setUploading(true);
    console.log(selectedChat._id);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/message`,
        imageData,
        config
      );

      console.log(data);
      socket.emit("new message", data);
      setNewMessage("");
      setMessages([...messages, data]);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
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
        socket.emit("sold", buyerId);
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
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    isMounted.current = true;

    fetchMessages(source);

    selectedChatCompare = selectedChat;

    return () => {
      isMounted.current = false;
      source.cancel("Component unmounted, cancelling axios requests");
    };
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          if (!messageNotification.includes(newMessageReceived)) {
            console.log(newMessageReceived);
            setMessageNotification([
              newMessageReceived,
              ...messageNotification,
            ]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });

      socket.on("sold", () => {
        navigate(0);
      });
      return () => {
        socket.off("message received");
      };
    }
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
              {uploading && (
                <CircularProgress size={24} sx={{ marginLeft: 2 }} />
              )}
              <ScrollableChat messages={messages} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <form encType="multipart/form-data" method="POST">
                <input
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  onChange={handleImage}
                  id="icon-button-file"
                />
                <IconButton size="small" color="inherit">
                  <label htmlFor="icon-button-file">
                    <Badge>
                      <AddPhotoAlternateIcon />
                    </Badge>
                  </label>
                </IconButton>
              </form>
            </div>
            <InputBase
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #4a4b4b",
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
          </div>
        </>
      ) : selectedChat === "" ? (
        <Box sx={{ padding: 2 }}>Select a group chat to chat</Box>
      ) : (
        <Box sx={{ padding: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default SingleChat;
