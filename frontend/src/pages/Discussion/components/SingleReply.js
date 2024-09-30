import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import auth from "../../../helpers/Auth";
import React, { useState } from "react";
import { deleteReply, updateReply } from "../api/DiscussionApi";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Markup } from "interweave";

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
    <div key={comment._id} style={{ paddingLeft: "10%" }}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={`http://localhost:8000/${comment.author.avatar_url}`}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{ textDecoration: "none", color: "inherit" }}
                component={Link}
                to={`/profile/${comment.author._id}`}
              >
                {comment.author.username}
              </Typography>
            }
            secondary={comment.createdAt}
          />
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id === comment.author._id ? (
            <>
              <IconButton onClick={handleOpenOptions}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseOptions}
              >
                <MenuItem
                  onClick={(e) => {
                    handleOpenEditing();
                    handleCloseOptions();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    onDeleteReply();
                    handleCloseOptions();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : (
            ""
          )}
        </ListItem>
        <ListItem>
          {openEditing ? (
            <TextField
              sx={{ width: "100%" }}
              value={commentEditing.text}
              placeholder="Your Answer"
              variant="outlined"
              multiline={true}
              onChange={handleCommentEditing("text")}
            />
          ) : (
            <ListItemText
              primary={
                <Typography>
                  <Markup content={comment.text} />
                </Typography>
              }
            />
          )}
          {openEditing ? (
            <Button
              variant="contained"
              sx={{ margin: "10px" }}
              onClick={onSaveEditing}
            >
              Save
            </Button>
          ) : null}
        </ListItem>
      </List>
    </div>
  );
}
