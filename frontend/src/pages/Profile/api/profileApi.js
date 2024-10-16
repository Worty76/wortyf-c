import axios from "axios";

const updateBio = async (credentials, body) => {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API}/api/user/update`,
      body,
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

export { updateBio };
