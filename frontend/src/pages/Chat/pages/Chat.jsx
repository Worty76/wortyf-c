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
    <section className="p-4 h-full">
      <div className="mx-auto max-w-screen-lg flex h-full">
        {user && (
          <div className="flex w-full h-full">
            <MyChats fetchAgain={fetchAgain} />
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>
    </section>
  );
};
