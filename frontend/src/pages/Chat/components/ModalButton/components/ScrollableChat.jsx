import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip, Typography } from "@material-tailwind/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../../../logic/ChatLogics";
import auth from "../../../../../helpers/Auth";

const ScrollableChat = ({ messages }) => {
  return (
    <ScrollableFeed className="p-2">
      {messages && messages.length > 0 ? (
        messages.map((m, i) => (
          <div key={m._id} className="flex items-end mb-1 ">
            {(isSameSender(messages, m, i, auth.isAuthenticated().user._id) ||
              isLastMessage(messages, i, auth.isAuthenticated().user._id)) && (
              <Tooltip
                placement="bottom-start"
                className="mr-2"
                content={m.sender.username}
                arrow
              >
                <Avatar
                  src={m.sender.avatar_url}
                  alt={m.sender.username}
                  className="w-10 h-10"
                />
              </Tooltip>
            )}
            <div
              style={{
                marginLeft:
                  isSameSenderMargin(
                    messages,
                    m,
                    i,
                    auth.isAuthenticated().user._id
                  ) === "auto"
                    ? "auto"
                    : `${isSameSenderMargin(
                        messages,
                        m,
                        i,
                        auth.isAuthenticated().user._id
                      )}px`,
              }}
              className={`${
                m.sender._id === auth.isAuthenticated().user._id
                  ? "bg-blue-200"
                  : "bg-green-200"
              } mt-${
                isSameUser(messages, m, i, auth.isAuthenticated().user._id)
                  ? 0
                  : 1
              } rounded-lg p-2 max-w-[75%] shadow-sm break-words relative`}
            >
              <Typography variant="body2">
                {m.content && m.content}
                {m.image && (
                  <img
                    alt=""
                    className="w-40 h-40 object-cover rounded-lg"
                    src={m.image}
                  />
                )}
              </Typography>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-4">
          <Typography variant="body2" className="text-gray-500">
            No messages yet
          </Typography>
        </div>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
