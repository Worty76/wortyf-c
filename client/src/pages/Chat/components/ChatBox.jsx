import { Box, Button } from "../../../../node_modules/@material-ui/core/index";
import SingleChat from "./SingleChat";
import { ChatState } from "../../../context/ChatProvider";

function ChatBox() {
  const { selectedChat, setSelectedChat } = ChatState();

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "lightgreen",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Button onClick={() => setSelectedChat("")}>Leave Chat</Button>
      </Box>
      <Box>
        <SingleChat />
      </Box>
    </Box>
  );
}

export default ChatBox;
