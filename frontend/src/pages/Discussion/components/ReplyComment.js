import React, { useEffect, useState } from "react";
import SingleReply from "./SingleReply";

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
    <div>
      {openViewMore && amountOfChildComments > 1 && (
        <p
          onClick={handleOpenReplies}
          style={{ cursor: "pointer", paddingLeft: "2%" }}
        >
          View {amountOfChildComments} more comments
        </p>
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
