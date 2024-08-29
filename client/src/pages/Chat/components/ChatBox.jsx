import { Box, Button } from "@mui/material";
import SingleChat from "./SingleChat";
import { ChatState } from "../../../context/ChatProvider";

function ChatBox() {
  const { setSelectedChat } = ChatState();

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Button onClick={() => setSelectedChat("")}>Leave Chat</Button>
      </Box>
      <Box style={{ flex: 1, overflow: "hidden" }}>
        <SingleChat />
      </Box>
    </Box>
  );
}

export default ChatBox;