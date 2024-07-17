import React, { useEffect, useState } from "react";
import MyChats from "./components/MyChats";
import { Box } from "../../../node_modules/@material-ui/core/index";
import ChatBox from "./components/ChatBox";
import auth from "../../helpers/Auth";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const user = auth.isAuthenticated();

  const [fetchAgain, setFetchAgain] = useState(false);
  console.log(user);

  useEffect(() => {
    if (!user) return navigate("/signin");
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {user && <MyChats fetchAgain={fetchAgain} />}

      {user && (
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </Box>
  );
}

export default Chat;
