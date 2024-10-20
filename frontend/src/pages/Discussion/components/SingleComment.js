import axios from "axios";
import { useEffect, useRef, useState } from "react";
import BestAnswer from "../../../components/customIcons/Mark";
import {
  Typography,
  Carousel,
  Textarea,
  Button,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import ReplyComment from "./ReplyComment";
import { VariantType, useSnackbar } from "notistack";
import {
  createReply,
  deleteComment,
  updateComment,
} from "../api/DiscussionApi";
import auth from "../../../helpers/Auth";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Markup } from "interweave";
import TextEditor from "./TextEditor";
import moment from "moment";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

export default function SingleComment({
  updateComments,
  comment,
  postId,
  authorId,
}) {
  const [openReply, setOpenReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [openEditing, setOpenEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const editorRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };
  const [text, setText] = useState("");

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
    text && reply.append("text", text);

    createReply(
      { postId: postId, commentId: comment._id },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      reply
    ).then((data) => {
      if (data.stack) {
        console.log(data.stack);
      } else {
        const reply = JSON.parse(data);
        setReplies([...replies, reply]);
        setText("");
        handleReply();
        handleVariant("success");
      }
    });
  };

  // Update replies
  const updateReplies = (replies) => {
    setReplies(replies);
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
          `${process.env.REACT_APP_API}/api/post/${postId}/comment/${comment._id}/read`,
          {
            cancelToken: signal,
          }
        )
        .then((response) => {
          setReplies(response.data.data);
        })
        .catch(function (thrown) {
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

  const handleReply = () => {
    setOpenReply(!openReply);
  };

  return (
    <>
      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-4">
          <Avatar
            src={comment.author.avatar_url}
            alt="avatar"
            variant="rounded"
            className="w-12 h-12 object-cover"
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
        <Button
          variant="text"
          className="flex items-center gap-2 p-2"
          size="sm"
          onClick={handleReply}
        >
          <ArrowUturnLeftIcon strokeWidth={2} className="h-5 w-5" />
          <Typography variant="h6" className="text-xs">
            REPLY
          </Typography>
        </Button>
      </div>
      {/* Reply */}
      {openReply && (
        <div className="mt-6 my-2 sm:mt-2 lg:mt-4 ml-4 sm:ml-10 lg:ml-16 xl:ml-20 pl-4 sm:pl-6 lg:pl-8">
          <Textarea
            rows={4}
            label="Message"
            className="mb-2"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div></div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="text"
                className="rounded-md"
                onClick={handleReply}
              >
                Close
              </Button>
              <Button size="sm" className="rounded-md" onClick={onCreateReply}>
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
      <ReplyComment
        postId={postId}
        comments={replies}
        commentFatherId={comment._id}
        updateReplies={updateReplies}
      />
    </>
  );
}
