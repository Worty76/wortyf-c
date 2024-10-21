import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Spinner,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import auth from "../../../../helpers/Auth";
import UserListItem from "./components/UserListItem";
import UserBadgeItem from "./components/UserBadgeItem";
import { ChatState } from "../../../../context/ChatProvider";

function GroupChatModal() {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
      console.log("Chat created");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)} className="bg-blue-500">
        New Group Chat
      </Button>
      <Dialog open={open} handler={setOpen} size="sm" className="p-4">
        <DialogBody>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Create Group Chat</h2>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              label="Group Name"
              className="input input-bordered w-full"
              onChange={(e) => setGroupChatName(e.target.value)}
              value={groupChatName}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              label="Find Username or Email"
              className="input input-bordered w-full"
              onChange={(e) => handleSearch(e.target.value)}
              value={search}
            />
          </div>
          {loading ? (
            <div className="flex justify-center my-4">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="mb-4">
              {searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="flex flex-row gap-2">
          <Button onClick={handleSubmit} className="bg-blue-500">
            Create
          </Button>
          <Button onClick={() => setOpen(false)} className="bg-red-500">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default GroupChatModal;
