import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import auth from "../../../../helpers/Auth";
import UserListItem from "./components/UserListItem";
import UserBadgeItem from "./components/UserBadgeItem";
import { ChatState } from "../../../../context/ChatProvider";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  marginTop: 2,
  backgroundColor: "#007bff",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
};

function GroupChatModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/user?search=${search}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
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
        `${process.env.REACT_APP_API}/api/chat/group`,
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
      <Button onClick={handleOpen} variant="contained" color="primary">
        New Group Chat
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Create Group Chat
          </Typography>
          <TextField
            id="group-name"
            label="Group Name"
            variant="standard"
            fullWidth
            margin="normal"
            onChange={(e) => setGroupChatName(e.target.value)}
            value={groupChatName}
          />
          <TextField
            id="search"
            label="Find Username or Email"
            variant="standard"
            fullWidth
            margin="normal"
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              {searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))}
            </Box>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          <Button onClick={handleSubmit} sx={buttonStyle} variant="contained">
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default GroupChatModal;
