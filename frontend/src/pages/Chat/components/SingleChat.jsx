import { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Spinner,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { ChatState } from "../../../context/ChatProvider";
import auth from "../../../helpers/Auth";
import axios from "axios";
import ScrollableChat from "./ModalButton/components/ScrollableChat";
import { Link } from "react-router-dom";
import { sold } from "../api/ChatApi";
import RateModalButton from "./RateModalButton/RateModalButton";
import { debounce } from "lodash";
import { useSocket } from "../../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

var selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const isMounted = useRef(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const {
    selectedChat,
    messageNotification,
    setMessageNotification,
    setNotification,
    setSelectedChat,
    notification,
    setChats,
  } = ChatState();

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

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

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

  const soldPost = (postId, buyerId, chatId) => {
    sold(
      { postId: postId, buyerId: buyerId, chatId: chatId },
      { t: JSON.parse(auth.isAuthenticated().token) }
    ).then((data) => {
      console.log(JSON.parse(data));
      const chat = JSON.parse(data);
      setChats((prevChat) =>
        prevChat.map((c) => (c._id === chat._id ? chat : c))
      );
      setSelectedChat(chat);
      socket.emit("sold", chat);
    });
  };

  const debouncedSendMessage = debounce(sendMessage, 200);

  useEffect(() => {
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

      socket.on("sold", (chat) => {
        setChats((prevChat) =>
          prevChat.map((c) => (c._id === chat._id ? chat : c))
        );
        setSelectedChat(chat);
      });

      socket.on("notification", (noti) => {
        setNotification([noti, ...notification]);
      });

      return () => {
        socket.off("message received");
        socket.off("notification");
        socket.off("sold");
      };
    }
  });

  return (
    <div className="h-full max-h-full flex flex-col">
      {selectedChat && selectedChat === selectedChatCompare ? (
        <>
          <div className="flex-grow max-h-[calc(100vh-200px)] overflow-y-auto">
            {selectedChat.post && (
              <div className="p-2 flex rounded-lg">
                <Card className="flex flex-row items-center w-full">
                  {selectedChat.post?.images?.length > 0 && (
                    <div className="w-24 h-24">
                      <img
                        alt=""
                        className="object-cover rounded-lg w-full h-full"
                        src={selectedChat.post?.images[0]}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full p-4">
                    <div>
                      <Typography
                        className="cursor-pointer text-black no-underline hover:text-gray-500 transition duration-200"
                        onClick={() =>
                          navigate(`/post/${selectedChat.post._id}`)
                        }
                      >
                        {selectedChat.post.name}
                      </Typography>
                      <Typography className="text-red-500">
                        {selectedChat.post.price}
                      </Typography>
                    </div>
                    <div>
                      {auth.isAuthenticated().user._id ===
                        selectedChat.post.author._id &&
                        (!selectedChat.post.sold ? (
                          <Button
                            color="green"
                            onClick={() =>
                              soldPost(
                                selectedChat.post._id,
                                selectedChat.users[0]?._id ===
                                  auth.isAuthenticated().user?._id
                                  ? selectedChat.users[1]._id
                                  : selectedChat.users[0]._id,
                                selectedChat._id
                              )
                            }
                          >
                            Sold
                          </Button>
                        ) : (
                          <Button color="green" variant="text" disabled>
                            Sold
                          </Button>
                        ))}
                      {console.log(selectedChat.post)}
                      {auth.isAuthenticated().user._id ===
                        selectedChat.post.buyer?._id &&
                        (selectedChat.post.rated ? (
                          <Typography
                            sx={{ color: "green", textDecoration: "none" }}
                            component={Link}
                            to={`/profile/${selectedChat.post.author._id}`}
                          >
                            You already rated, click here to see
                          </Typography>
                        ) : (
                          <RateModalButton chat={selectedChat} />
                        ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
            <ScrollableChat messages={messages} />
          </div>
          <div className="flex items-center w-full p-4 gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={debouncedSendMessage}
              placeholder="Type a message..."
              className="flex-grow border-2 border-gray-300 rounded-lg p-3 mr-2"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {uploading ? (
                <Spinner className="h-6 w-6" />
              ) : (
                <IconButton
                  variant="text"
                  onClick={() => document.getElementById("file-input").click()}
                  className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </IconButton>
              )}
              <input
                type="file"
                id="file-input"
                onChange={handleImage}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Typography>Select a chat</Typography>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
