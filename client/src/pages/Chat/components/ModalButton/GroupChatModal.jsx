import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Input,
  TextField,
} from "../../../../../node_modules/@material-ui/core/index";
import axios from "../../../../../node_modules/axios/index";
import auth from "../../../../helpers/Auth";
import UserListItem from "./components/UserListItem";
import UserBadgeItem from "./components/UserBadgeItem";

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
  p: 4,
};

function GroupChatModal() {
  // Handle Group Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Variables
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

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
          <TextField label="Group Name" color="primary" focused />

          <Input
            placeholder="Placeholder"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>

          {searchResult?.slice(0, 4).map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleGroup(user)}
            />
          ))}
        </Box>
      </Modal>
    </div>
  );
}

export default GroupChatModal;
