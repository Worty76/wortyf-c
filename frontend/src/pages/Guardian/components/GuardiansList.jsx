import React from "react";
import { Avatar, Typography, Button, Rating } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import auth from "../../../helpers/Auth";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";

export const GuardiansList = ({ guardians }) => {
  const navigate = useNavigate();

  const { chats, setChats, setSelectedChat } = ChatState();

  const accessChat = async (user) => {
    const userId = user._id;
    console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigate(`/chat/${data._id}`);
    } catch (error) {}
  };

  return (
    <div className="mt-4 flex flex-col gap-6">
      {guardians.map((guardian, index) => (
        <div
          key={index}
          className="flex flex-wrap justify-between items-center"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar
              src={guardian.avatar_url}
              alt="avatar"
              size="xl"
              variant="rounded"
            />
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <Typography
                color="blue-gray"
                variant="h6"
                className="truncate cursor-pointer"
                onClick={() => navigate(`/profile/${guardian._id}`)}
              >
                {guardian.username}
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-gray-600 truncate"
              >
                {guardian.bio}
              </Typography>
              <Rating value={guardian.avgRating} readonly />
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="text"
              className="flex items-center gap-2"
              size="sm"
              onClick={() => accessChat(guardian)}
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
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              Message
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
