import axios from "axios";

const sold = async ({ postId, buyerId }, credentials, markAnswer) => {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/post/sold`,
      { postId, buyerId },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    console.log(response);
    return JSON.stringify(response.data.message);
  } catch (error) {
    return error;
  }
};

const rate = async (
  { postId, buyerId, sellerId, noOfStars, comment },
  credentials
) => {
  try {
    let response = await axios.post(
      `http://localhost:8000/api/rating/rate`,
      { postId, buyerId, sellerId, noOfStars, comment },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    console.log(response);
    return JSON.stringify(response.data.message);
  } catch (error) {
    return error;
  }
};

export { sold, rate };
