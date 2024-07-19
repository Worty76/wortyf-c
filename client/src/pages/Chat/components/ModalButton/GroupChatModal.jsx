import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import axios from "axios";
import auth from "../../../../helpers/Auth";
import UserListItem from "./components/UserListItem";
import UserBadgeItem from "./components/UserBadgeItem";
import { ChatState } from "../../../../context/ChatProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
};

function GroupChatModal() {
  // Handle Group Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Variables
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupChatName, setGroupChatName] = useState();

  const { chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      console.log("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8000/api/user?search=${search}`,
        config
      );
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      console.log("Fill all the required fields!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      console.log("Chat created");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>New Group Chat</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box>
                <div
                  style={{
                    paddingBottom: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Group Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Find Username or Email"
                    variant="outlined"
                    onChange={(e) => handleSearch(e.target.value)}
                    fullWidth
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", padding: 2 }}>
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </div>
              </Box>
              <Box>
                <Button
                  onClick={handleSubmit}
                  sx={{ backgroundColor: "lightblue" }}
                >
                  Create
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: "100%" }}>
              <div style={{ padding: 10 }}>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default GroupChatModal;
