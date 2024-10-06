import axios from "axios";

const createComment = async (params, credentials, comment) => {
  try {
    let response = await axios.post(
      `http://localhost:8000/api/post/${params.id}/comment/create`,
      comment,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.data);
  } catch (error) {
    return error;
  }
};

const createReply = async (params, credentials, reply) => {
  try {
    let response = await axios.post(
      `http://localhost:8000/api/post/${params.postId}/comment/${params.commentId}/reply`,
      reply,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.reply);
  } catch (error) {
    return error;
  }
};

const createLike = async (params, credentials, like) => {
  try {
    let response = await axios.post(
      `http://localhost:8000/api/post/${params.id}/like`,
      like,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.data);
  } catch (error) {
    return error;
  }
};

const deleteLike = async (params, credentials) => {
  try {
    let response = await axios.delete(
      `http://localhost:8000/api/post/${params.id}/unlike`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.data);
  } catch (error) {
    return error;
  }
};

const deletePost = async (params, credentials, deletePostEmit) => {
  try {
    let response = await axios.delete(
      `http://localhost:8000/api/post/${params.id}/delete`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        data: {
          deletePostEmit,
        },
      }
    );
    return JSON.stringify(response.data);
  } catch (error) {
    return error;
  }
};

const deleteComment = async (params, credentials, deleteCommentEmit) => {
  try {
    let response = await axios.delete(
      `http://localhost:8000/api/post/${params.postId}/comment/${params.commentId}/delete`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        data: {
          deleteCommentEmit,
        },
      }
    );
    return JSON.stringify(response.data);
  } catch (error) {
    return error;
  }
};

const deleteReply = async (params, credentials, deleteReplyEmit) => {
  try {
    let response = await axios.delete(
      `http://localhost:8000/api/post/${params.postId}/comment/${params.commentId}/reply/${params.replyId}/delete`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        data: {
          deleteReplyEmit,
        },
      }
    );
    return JSON.stringify(response.data.replies);
  } catch (error) {
    return error;
  }
};

const updatePost = async (params, credentials, post) => {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/post/${params.id}/update`,
      post,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.message);
  } catch (error) {
    return error;
  }
};

const updateComment = async (params, credentials, commentData) => {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/post/${params.postId}/comment/${params.commentId}/update`,
      commentData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    console.log(JSON.stringify(response.data.comments));
    return JSON.stringify(response.data.comments);
  } catch (error) {
    return error;
  }
};

const updateReply = async (params, credentials, commentData) => {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/post/${params.postId}/comment/${params.commentId}/reply/${params.replyId}/update`,
      commentData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return JSON.stringify(response.data.replies);
  } catch (error) {
    return error;
  }
};

export {
  createComment,
  createReply,
  createLike,
  deletePost,
  deleteComment,
  deleteReply,
  updatePost,
  updateComment,
  updateReply,
  deleteLike,
};
