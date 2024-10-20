import React, { useEffect, useState } from "react";
import SingleReply from "./SingleReply";
import { Typography } from "@material-tailwind/react";

export default function ReplyComment({
  postId,
  comments,
  commentFatherId,
  updateReplies,
}) {
  const [amountOfChildComments, setAmountOfChildComments] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);
  const [openViewMore, setOpenViewMore] = useState(true);
  const handleOpenReplies = () => {
    setOpenReplyComments(!openReplyComments);
    setOpenViewMore(!openViewMore);
  };

  useEffect(() => {
    let childCommentNumber = 0;
    // eslint-disable-next-line
    comments.map((comment) => {
      if (comment.comment_father === commentFatherId) {
        childCommentNumber++;
      }
      setAmountOfChildComments(childCommentNumber);
    });
  }, [comments, commentFatherId]);

  return (
    <div className="gap-4 mt-5 ml-10 sm:ml-10 lg:ml-6 xl:ml-6 pl-4 sm:pl-6 lg:pl-8">
      {openViewMore && amountOfChildComments > 1 && (
        <Typography
          onClick={handleOpenReplies}
          variant="h6"
          className="font-normal cursor-pointer text-sm text-gray-700"
        >
          View {amountOfChildComments} more comments
        </Typography>
      )}

      {(openReplyComments || amountOfChildComments === 1) &&
        comments.map((comment) => (
          <SingleReply
            key={comment._id}
            comment={comment}
            postId={postId}
            commentFatherId={commentFatherId}
            updateReplies={updateReplies}
          />
        ))}
    </div>
  );
}
