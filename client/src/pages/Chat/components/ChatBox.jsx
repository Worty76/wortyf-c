import { Box, Button } from "@mui/material";
import SingleChat from "./SingleChat";
import { ChatState } from "../../../context/ChatProvider";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { getSender } from "../../../Logic/ChatLogics";
import auth from "../../../helpers/Auth";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { setSelectedChat, notification, setNotification } = ChatState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
        <div>
          <IconButton size="small" color="inherit" onClick={handleClick}>
            <Badge badgeContent={notification.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: 300,
              },
            }}
          >
            <div style={{ padding: 5 }}>
              <b>New Messages</b>
            </div>
            <div style={{ padding: 5 }}>
              {!notification.length && "No New Messages"}
              {notification?.map((noti) => (
                <MenuItem
                  key={noti.id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(
                        auth.authenticated().user,
                        noti.chat.users
                      )}`}
                </MenuItem>
              ))}
            </div>
          </Menu>
        </div>
      </Box>
      <Box style={{ flex: 1, overflow: "hidden" }}>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </Box>
  );
}

export default ChatBox;
