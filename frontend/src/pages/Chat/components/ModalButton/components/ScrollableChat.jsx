import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../../../logic/ChatLogics.js";
import auth from "../../../../../helpers/Auth";
import { Avatar, Tooltip, Typography, Box } from "@mui/material";

function ScrollableChat({ messages }) {
  return (
    <ScrollableFeed>
      {messages && messages.length > 0 ? (
        messages.map((m, i) => (
          <Box
            key={m._id}
            sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}
          >
            {(isSameSender(messages, m, i, auth.isAuthenticated().user._id) ||
              isLastMessage(messages, i, auth.isAuthenticated().user._id)) && (
              <Tooltip
                placement="bottom-start"
                arrow
                title={m.sender.username}
                sx={{ marginRight: 1 }}
              >
                <Avatar
                  src={m.sender.avatar_url}
                  alt={m.sender.username}
                  sx={{ width: 40, height: 40 }}
                />
              </Tooltip>
            )}
            <Box
              sx={{
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
                  ? 0
                  : 1,
                borderRadius: "20px",
                padding: "10px 15px",
                maxWidth: "75%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                position: "relative",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2" component="span">
                {m.content}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ textAlign: "center", padding: 2 }}>
          <Typography variant="body2" color="textSecondary">
            No messages yet
          </Typography>
        </Box>
      )}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
