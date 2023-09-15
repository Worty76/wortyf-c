import axios from "axios";
import { useEffect, useState } from "react";

export default function Topic({ topicId }) {
  const [topics, setTopics] = useState([]);

  const getTopics = async (signal) => {
    try {
      await axios
        .get("http://localhost:8000/api/topic", {
          cancelToken: signal,
        })
        .then((response) => {
          setTopics(response.data.data);
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
    getTopics(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {topics.map(function (topic, id) {
        if (topic._id === topicId) {
          return (
            <div
              style={{
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                border: `1px solid ${topic.color}`,
                margin: 5,
              }}
              key={id}
            >
              <div
                style={{
                  fontSize: "clamp(0.7rem, 5vw, 0.3rem)",
                  color: `${topic.color}`,
                  fontWeight: "700",
                  padding: 5,
                }}
              >
                {topic.name}
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </>
  );
}
