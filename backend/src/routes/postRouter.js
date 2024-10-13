const express = require("express");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const likeController = require("../controllers/likeController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// Post
router.get("/", postController.getApprovedPosts);
router.get("/search", postController.searchPost);
router.get("/:id", postController.getSpecificPost);
router.post("/create", verifyToken, postController.createPost);
router.put("/:id/update", verifyToken, postController.updatePost);
router.delete("/:id/delete", verifyToken, postController.deletePost);
router.put("/sold", verifyToken, postController.sold);

// Moderator
router.get(
  "/moderator/in-approval-posts",
  verifyToken,
  checkRole("moderator"),
  postController.getInApprovalPosts
);

router.put(
  "/moderator/approve-post/:id",
  verifyToken,
  checkRole("moderator"),
  postController.approvePost
);

// Comment
router.get("/:id/comment/:commentId/read", commentController.readComment);
router.post(
  "/:id/comment/create",
  verifyToken,
  commentController.createComment
);
router.put(
  "/:id/comment/:CommentId/update",
  verifyToken,
  commentController.updateComment
);
router.delete(
  "/:id/comment/:CommentId/delete",
  verifyToken,
  commentController.deleteComment
);

// Reply
router.post(
  "/:id/comment/:CommentId/reply",
  verifyToken,
  commentController.createReply
);
router.put(
  "/:id/comment/:CommentId/reply/:SubCommentId/update",
  verifyToken,
  commentController.updateReply
);
router.delete(
  "/:id/comment/:CommentId/reply/:SubCommentId/delete",
  verifyToken,
  commentController.deleteReply
);

// Like
router.post("/:id/like", verifyToken, likeController.likePost);
router.delete("/:id/unlike", verifyToken, likeController.unLikePost);

module.exports = router;
