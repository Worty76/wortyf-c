import {
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Input,
} from "@material-tailwind/react";
import auth from "../../../helpers/Auth";
import React, { useState } from "react";
import { deleteReply, updateReply } from "../api/DiscussionApi";
import moment from "moment";

export default function SingleReply({
  comment,
  postId,
  commentFatherId,
  updateReplies,
}) {
  const [openEditing, setOpenEditing] = useState(false);
  const [commentEditing, setCommentEditing] = useState({
    text: comment.text,
  });

  const handleOpenEditing = (text) => {
    setOpenEditing(!openEditing);
  };

  const handleCommentEditing = (name) => (event) => {
    setCommentEditing({ ...commentEditing, [name]: event.target.value });
  };

  const onDeleteReply = () => {
    let deleteReplyEmit = new FormData();
    deleteReply(
      { postId: postId, commentId: commentFatherId, replyId: comment._id },
      { t: JSON.parse(auth.isAuthenticated().token) },
      deleteReplyEmit
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        const replies = JSON.parse(data);
        console.log(replies);
        updateReplies(replies);
      }
    });
  };

  const onSaveEditing = () => {
    let commentData = new FormData();
    commentEditing.text && commentData.append("text", commentEditing.text);

    updateReply(
      { postId: postId, commentId: commentFatherId, replyId: comment._id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      commentData
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        const replies = JSON.parse(data);
        console.log(replies);
        updateReplies(replies);
        handleOpenEditing();
      }
    });
  };

  return (
    <div className="flex mt-5 sm:mt-2 lg:mt-4 justify-between items-center">
      <div className="flex flex-row items-center gap-4">
        <div>
          <Avatar
            src={comment.author.avatar_url}
            alt="avatar"
            className="w-12 h-12 object-cover"
            variant="rounded"
          />
        </div>
        <div>
          <Typography variant="h6" className="whitespace-nowrap">
            {comment.author.username} -{" "}
            <span className="text-gray-500 text-sm font-normal">
              {moment(new Date(comment.createdAt)).fromNow()}
            </span>
          </Typography>
          {openEditing ? (
            <Input
              label="Change your reply"
              value={commentEditing.text}
              onChange={handleCommentEditing("text")}
            />
          ) : (
            <Typography
              variant="small"
              color="gray"
              className="font-normal max-w-md break-words"
            >
              {comment.text}
            </Typography>
          )}
        </div>
      </div>
      <div>
        {auth.isAuthenticated() &&
          auth.isAuthenticated().user._id === comment.author._id &&
          (openEditing ? (
            <IconButton variant="text" color="green" onClick={onSaveEditing}>
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
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </IconButton>
          ) : (
            <Menu>
              <MenuHandler>
                <IconButton variant="text" size="sm">
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
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleOpenEditing}>Edit</MenuItem>
                <MenuItem onClick={onDeleteReply}>Delete</MenuItem>
              </MenuList>
            </Menu>
          ))}
      </div>
    </div>
  );
}
