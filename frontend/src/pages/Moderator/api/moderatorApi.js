import axios from "axios";

const approve = async (params, credentials, approvePost) => {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API}/api/post/moderator/approve-post/${params.postId}`,
      approvePost,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

const reject = async (params, credentials, rejectPost) => {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API}/api/post/moderator/reject-post/${params.postId}`,
      rejectPost,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export { approve, reject };
