import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../../../Logic/ChatLogics.js";
import auth from "../../../../../helpers/auth.js";
import { Avatar, Tooltip } from "@mui/material";

function ScrollableChat({ messages }) {
  return (
    <ScrollableFeed>
      {" "}
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, auth.isAuthenticated().user._id) ||
              isLastMessage(messages, i, auth.isAuthenticated().user._id)) && (
              <Tooltip
                placement="bottom-start"
                arrow={true}
                title={m.sender.username}
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  src={`http://localhost:8000/${m.sender.avatar_url}`}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === auth.isAuthenticated().user._id
                    ? "#BEE3F8"
                    : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  auth.isAuthenticated().user._id
                ),
                marginTop: isSameUser(
                  messages,
                  m,
                  i,
                  auth.isAuthenticated().user._id
                )
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
