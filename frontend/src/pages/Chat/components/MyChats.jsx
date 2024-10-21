import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Drawer,
  Button,
  Typography,
  Input,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import auth from "../../../helpers/Auth";
import GroupChatModal from "./ModalButton/GroupChatModal";
import { getSender, getSenderAvatar } from "../../../logic/ChatLogics";
import UserListItem from "./ModalButton/components/UserListItem";

function MyChats({ fetchAgain }) {
  const { chatId } = useParams();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [hasCalledEffect, setHasCalledEffect] = useState(false);
  const isMounted = useRef(true);

  const toggleDrawer = (newOpen) => () => {
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
        `${process.env.REACT_APP_API}/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {}
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {}
  };

  const fetchChats = async (source) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: source.token,
      };
      await axios
        .get(`${process.env.REACT_APP_API}/api/chat`, config)
        .then((response) => {
          if (isMounted.current) {
            setChats(response.data);
          }
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });

      if (isMounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    isMounted.current = true;

    fetchChats(source);
    return () => {
      isMounted.current = false;
      setSelectedChat("");
      source.cancel("Component unmounted, cancelling axios requests");
    };
    // eslint-disable-next-line
  }, [fetchAgain]);

  useEffect(() => {
    if (!chats) return;
    if (!hasCalledEffect) {
      if (chats && chatId) {
        const chatExists = chats.find((chat) => chat._id === chatId);
        if (chatExists) {
          setSelectedChat(chatExists);
        } else {
          console.log("Chat ID not found in fetched chats");
        }
      }

      setHasCalledEffect(true);
    }
    // eslint-disable-next-line
  }, [chatId, chats, hasCalledEffect, setSelectedChat]);

  return (
    <>
      <div
        className={`${
          selectedChat ? "hidden" : "block"
        } w-full md:w-1/3 h-full overflow-y-auto md:block`}
      >
        <div className="p-2 flex justify-between items-center border-b bg-white">
          <Typography variant="h6">My Chats</Typography>
          <div className="flex">
            <Button
              variant="filled"
              color="blue"
              size="sm"
              className="mr-2"
              onClick={toggleDrawer(true)}
            >
              Search User
            </Button>
            {auth.isAuthenticated().user.role === "guardian" && (
              <GroupChatModal />
            )}
          </div>
        </div>
        <div className="h-full overflow-auto">
          {loading ? (
            <div className="flex justify-center p-2">
              <Spinner color="blue" />
            </div>
          ) : chats?.length > 0 ? (
            chats.map((chat, id) => (
              <div
                key={id}
                onClick={() => {
                  setSelectedChat(chat);
                  navigate(`/chat/${chat._id}`);
                }}
                className={`p-2 mb-1 cursor-pointer transition-colors ${
                  selectedChat._id === chat._id
                    ? "bg-teal-100 text-teal-700 rounded-md"
                    : "bg-white text-black rounded-md"
                } hover:bg-green-100 rounded-md`}
              >
                <div className="flex justify-between w-full">
                  <div className="flex items-center">
                    <Avatar
                      src={
                        !chat.isGroupChat
                          ? getSenderAvatar(
                              auth.isAuthenticated().user,
                              chat.users
                            )
                          : chat.chatName
                      }
                      alt="chat-avatar"
                    />
                    <div className="ml-2">
                      <Typography variant="h6">
                        {!chat.isGroupChat
                          ? getSender(auth.isAuthenticated().user, chat.users)
                          : chat.chatName}
                      </Typography>
                      <Typography className="text-sm text-gray-500 truncate">
                        {chat.latestMessage
                          ? `${chat.latestMessage.sender.username}: ${chat.latestMessage.content}`
                          : ""}
                      </Typography>
                    </div>
                  </div>
                  {chat.post?.images && (
                    <img
                      alt=""
                      className="object-cover rounded-lg max-h-20 w-auto"
                      src={chat.post.images[0]}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-2">No Chats Available</div>
          )}
        </div>
      </div>

      <Drawer open={open} onClose={toggleDrawer(false)} placement="left">
        <div>
          <div className="border-b p-4">
            <Typography variant="h6">Search Users</Typography>
          </div>
          <div className="p-4">
            <div className="flex pb-2">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mr-2"
              />
              <Button variant="filled" color="blue" onClick={handleSearch}>
                Go
              </Button>
            </div>
            {loading ? (
              <Spinner color="blue" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                    setOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default MyChats;
