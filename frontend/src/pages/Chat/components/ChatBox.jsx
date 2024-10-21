import { Button, IconButton } from "@material-tailwind/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat } = ChatState();
  const navigate = useNavigate();

  return (
    <div
      className={`flex-1 h-full flex flex-col overflow-hidden w-full md:w-2/3 md:flex ${
        selectedChat ? "block" : "hidden"
      } md:block`}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
      >
        <IconButton
          variant="text"
          size="sm"
          onClick={() => {
            setSelectedChat("");
            navigate("/chat");
          }}
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </IconButton>
      </div>
      <div className="h-full overflow-hidden flex-1">
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
}

export default ChatBox;
