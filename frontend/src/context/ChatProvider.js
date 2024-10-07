import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "../helpers/Auth";
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn || auth.isAuthenticated()) {
      const fetchChats = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
          },
        };
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API}/api/chat`,
            config
          );
          setChats(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchChats();
    }
    console.log("Chat's states are ready");
  }, [isLoggedIn]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        setIsLoggedIn,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
