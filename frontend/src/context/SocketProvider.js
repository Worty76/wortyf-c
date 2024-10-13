import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../helpers/Auth";
import { ChatState } from "./ChatProvider";

const SocketContext = createContext();
const ENDPOINT = `${process.env.REACT_APP_API}`;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { isLoggedIn } = ChatState();
  const [user, setUser] = useState(
    auth.isAuthenticated() ? auth.isAuthenticated().user : null
  );

  useEffect(() => {
    if (isLoggedIn || auth.isAuthenticated()) {
      const authenticatedUser = auth.isAuthenticated().user;
      setUser(authenticatedUser);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      const user = auth.isAuthenticated().user;
      const newSocket = io(ENDPOINT, { transports: ["polling"] });
      setSocket(newSocket);

      newSocket.emit("setup", user);
      newSocket.on("connected", () => setSocketConnected(true));

      return () => {
        newSocket.off("connected");
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
