import axios from "axios";

const approve = async (params, credentials, approvePost) => {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/post/moderator/approve-post/${params.postId}`,
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

export { approve };
