import { useEffect, useState } from "react";
import axios from "axios";
import auth from "../../../../helpers/Auth";
import { Typography, Avatar, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export const InApprovalPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getPosts = async (signal) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: signal,
      };

      await axios
        .get(
          `${process.env.REACT_APP_API}/api/post/moderator/in-approval-posts`,
          config
        )
        .then((response) => {
          console.log(response.data.data);
          setPosts(response.data.data);
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

  // const handleRejectPost = (postId) => {
  //   let rejectPost = new FormData();

  //   reject(
  //     { postId: postId },
  //     { t: JSON.parse(auth.isAuthenticated().token) },
  //     rejectPost
  //   ).then((data) => {
  //     if (data.stack) {
  //     } else {
  //       handleVariant("success");
  //       setPosts(data);
  //     }
  //   });
  // };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getPosts(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <div className="flex flex-col gap-4">
          {posts &&
            posts.map((post) => (
              <Card
                shadow={false}
                className="border border-gray-300 rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <CardBody>
                  <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="h-24 w-24 md:h-32 object-cover rounded-xl"
                        src={post.images[0]}
                        alt="avatar"
                        variant="rounded"
                      />
                      <div>
                        <Typography color="blue-gray" variant="h6">
                          {post.name}
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600"
                        >
                          {post.content}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2"></div>
                  </div>
                </CardBody>
              </Card>
            ))}
          {posts && posts.length === 0 && (
            <Typography className="text-base">
              There's no posts in approval
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
};
