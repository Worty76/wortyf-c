import React, { useEffect, useState } from "react";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useNavigate } from "react-router-dom";
import auth from "../../../helpers/Auth";

export const Chat = () => {
  const navigate = useNavigate();
  const user = auth.isAuthenticated();

  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/sign-in");
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
      }}
    >
      {user && <MyChats fetchAgain={fetchAgain} />}

      {user && (
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </div>
  );
};
