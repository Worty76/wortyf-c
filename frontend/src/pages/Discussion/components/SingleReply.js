import {
  Typography,
  Carousel,
  Textarea,
  Button,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import auth from "../../../helpers/Auth";
import React, { useState } from "react";
import { deleteReply, updateReply } from "../api/DiscussionApi";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Markup } from "interweave";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

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
    <div className="flex gap-4 mt-5 sm:mt-2 lg:mt-4">
      <Avatar
        src={comment.author.avatar_url}
        alt="avatar"
        className="w-12 h-12 object-cover"
        variant="rounded"
      />
      <div>
        <Typography variant="h6" className="whitespace-nowrap">
          {comment.author.username} -{" "}
          <span className="text-gray-500 text-sm font-normal">
            {moment(new Date(comment.createdAt)).fromNow()}
          </span>
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="font-normal max-w-md break-words"
        >
          {comment.text}
        </Typography>
      </div>
    </div>
  );
}
