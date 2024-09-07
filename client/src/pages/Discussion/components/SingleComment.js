import {
  Avatar,
  Button,
  Divider,
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
import axios from "axios";
import { useEffect, useState } from "react";
import BestAnswer from "../../../components/customIcons/Mark";
import ReplyComment from "./ReplyComment";
import { VariantType, useSnackbar } from "notistack";
import {
  createReply,
  deleteComment,
  markAsAnswer,
  updateComment,
} from "../DiscussionApi";
import auth from "../../../helpers/Auth";
import { Link, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Markup } from "interweave";

export default function SingleComment({
  updateComments,
  comment,
  postId,
  solved,
  authorId,
}) {
  const [openReply, setOpenReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [openEditing, setOpenEditing] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };
  const [values, setValues] = useState({
    text: "",
    error: "",
  });

  const [commentEditing, setCommentEditing] = useState({
    text: comment.text,
  });

  const handleOpenEditing = () => {
    setOpenEditing(!openEditing);
  };

  const handleCommentEditing = (name) => (event) => {
    setCommentEditing({ ...commentEditing, [name]: event.target.value });
  };

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  const onCreateReply = () => {
    let reply = new FormData();
    values.text && reply.append("text", values.text);

    createReply(
      { postId: postId, commentId: comment._id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      reply
    ).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.error.message });
      } else {
        const reply = JSON.parse(data);
        setReplies([...replies, reply]);
        setValues({ values: "", error: "" });
        handleReply();
        handleVariant("success");
      }
    });
  };

  // Update replies
  const updateReplies = (replies) => {
    setReplies(replies);
  };

  const onMarkAnswer = () => {
    let markAnswer = new FormData();

    markAsAnswer(
      { postId: postId, commentId: comment._id },
      { t: JSON.parse(auth.isAuthenticated().token) },
      markAnswer
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        navigate(0);
      }
    });
  };

  const onDeleteComment = () => {
    let deleteCommentEmit = new FormData();
    deleteComment(
      { postId: postId, commentId: comment._id },
      { t: JSON.parse(auth.isAuthenticated().token) },
      deleteCommentEmit
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        console.log(data);
        const comments = JSON.parse(data);
        updateComments(comments.comments);
        handleVariant("success");
      }
    });
  };

  const onSaveEditing = () => {
    let commentData = new FormData();
    commentEditing.text && commentData.append("text", commentEditing.text);

    updateComment(
      { postId: postId, commentId: comment._id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      commentData
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        const comments = JSON.parse(data);
        console.log(comments);
        updateComments(comments);
        handleOpenEditing();
        handleVariant("success");
      }
    });
  };

  const getReplies = async (signal) => {
    try {
      await axios
        .get(
          `http://localhost:8000/api/post/${postId}/comment/${comment._id}/read`,
          {
            cancelToken: signal,
          }
        )
        .then((response) => {
          setReplies(response.data.data);
        })
        .catch(function(thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getReplies(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleReply = () => {
    setOpenReply(!openReply);
  };

  return (
    <div key={comment._id}>
      <br />
      <ListItem>
        <ListItemAvatar>
          <Avatar src={`http://localhost:8000/${comment.author.avatar_url}`} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component="a"
              href={`/profile/${comment.author._id}`}
              sx={{ textDecoration: "none" }}
              color="inherit"
            >
              {comment.author.username}
            </Typography>
          }
          secondary={comment.createdAt}
        />
        {comment.correctAns ? <BestAnswer /> : ""}
        {auth.isAuthenticated().user &&
        auth.isAuthenticated().user._id === comment.author._id &&
        !comment.correctAns ? (
          <>
            <IconButton onClick={handleOpenOptions}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseOptions}>
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
                  onDeleteComment();
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
        {auth.isAuthenticated().user &&
          (auth.isAuthenticated().user._id === authorId ? (
            solved ? null : (
              <Button variant="contained" onClick={onMarkAnswer}>
                Correct Answer
              </Button>
            )
          ) : null)}
      </ListItem>
      <ListItem>
        {openEditing ? (
          <TextField
            value={commentEditing.text}
            sx={{ width: "100%" }}
            placeholder="Your Answer"
            variant="outlined"
            multiline={true}
            onChange={handleCommentEditing("text")}
          />
        ) : (
          <ListItemText
            primary={
              <Typography gutterBottom>
                <Markup content={comment.text} />{" "}
              </Typography>
            }
          />
        )}

        {openEditing ? (
          <Button
            variant="contained"
            style={{ cursor: "pointer", margin: "10px" }}
            onClick={onSaveEditing}
          >
            Save
          </Button>
        ) : null}
        <Button
          onClick={handleReply}
          variant="outlined"
          style={{ cursor: "pointer" }}
        >
          Reply
        </Button>
      </ListItem>
      {openReply && (
        <List style={{ paddingLeft: "100px" }}>
          <ListItem>
            <TextField
              style={{ width: "100%" }}
              label={"Your answer"}
              onChange={handleChange("text")}
            />
            <List>
              <ListItem>
                {auth.isAuthenticated().user ? (
                  <Button
                    disabled={values.text ? false : true}
                    variant="contained"
                    onClick={onCreateReply}
                  >
                    Reply
                  </Button>
                ) : (
                  <Button
                    disabled={values.text ? false : true}
                    variant="contained"
                    LinkComponent={Link}
                    to="/signin"
                    sx={{ textAlign: "center" }}
                  >
                    Sign in to reply
                  </Button>
                )}
              </ListItem>
            </List>
          </ListItem>
        </List>
      )}
      <ReplyComment
        postId={postId}
        comments={replies}
        commentFatherId={comment._id}
        updateReplies={updateReplies}
      />
      <br />
      <Divider />
    </div>
  );
}
