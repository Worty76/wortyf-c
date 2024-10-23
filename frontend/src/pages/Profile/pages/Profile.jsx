import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Spinner,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { VariantType, useSnackbar } from "notistack";
import auth from "../../../helpers/Auth";
import { changeAvatar } from "../../Auth/api/authApi";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { updateBio } from "../api/profileApi";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { CardReview } from "../components/CardReview";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Post } from "../../Discussion/components/Post";
import Information from "../components/Information";

export const Profile = () => {
  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line
  const [image, setImage] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { setSelectedChat, chats, setChats } = ChatState();
  // eslint-disable-next-line
  const [avgRatings, setAvgRatings] = useState(0);
  const [updatedFields, setUpdatedFields] = useState({
    bio: "",
    from: "",
    gender: "",
    username: "",
    phone: "",
  });

  const navigate = useNavigate();
  const params = useParams();

  const getUser = async (signal) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/user/${params.id}`,
        {
          cancelToken: signal,
        }
      );
      const data = response.data;
      setUser(data.user);
      setUsersPosts(data.usersPosts);
      setRatings(data.ratings);
      setAvgRatings(data.avgRatings);
      console.log(data);
      setUpdatedFields({
        bio: data.user.bio || "",
        from: data.user.from || "",
        gender: data.user.gender || "",
        username: data.user.username || "",
        phone: data.user.phone || "",
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  const handleSave = () => {
    updateBio(
      { t: JSON.parse(auth.isAuthenticated().token) },
      updatedFields
    ).then((data) => {
      setUser(JSON.parse(data));
      handleVariant("success");
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    setImage(file);
    setUploading(true);

    try {
      const response = await changeAvatar(
        { id: params.id },
        { t: JSON.parse(auth.isAuthenticated().token) },
        imageData
      );
      console.log(response);
      auth.updateAvatarUrl(JSON.parse(response));
      window.location.reload(true);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const accessChat = async () => {
    const userId = user._id;
    console.log(userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      navigate(`/chat/${data._id}`);
    } catch (error) {}
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getUser(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line
  }, [params.id]);

  const data = [
    {
      label: "Ratings",
      value: "ratings",
      icon: StarIcon,
      desc: (
        <div className="mt-5">
          {ratings && ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <CardReview
                key={index}
                name={rating.author.username}
                feedback={rating.comment}
                date={rating.createdAt}
              />
            ))
          ) : (
            <Typography>No ratings</Typography>
          )}
        </div>
      ),
    },
    {
      label: "Posts",
      value: "posts",
      icon: UserCircleIcon,
      desc:
        usersPosts && usersPosts.length > 0 ? (
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-8">
            {usersPosts.map((post, key) => (
              <Post
                key={key}
                id={post._id}
                name={post.name}
                date={post.createdAt}
                price={post.price}
                authorName={post.author.username}
                imgs={post.images}
                profileImg={post.author.avatar_url}
              />
            ))}
          </CardBody>
        ) : (
          <div className="mt-5">
            <Typography>No posts</Typography>
          </div>
        ),
    },
    {
      label: "Information",
      value: "information",
      icon: UserCircleIcon,
      desc: (
        <Information
          bio={updatedFields.bio}
          from={updatedFields.from}
          gender={updatedFields.gender}
          username={updatedFields.username}
          phone={updatedFields.phone}
          user={user}
          handleFieldChange={handleFieldChange}
          handleSave={handleSave}
        />
      ),
    },
  ];

  return (
    <section className="p-8">
      <div className="container mx-auto max-w-screen-lg">
        <Card shadow={false} className="border border-gray-300 rounded-2xl">
          <CardBody>
            <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user && user.avatar_url}
                  alt="avatar"
                  variant="rounded"
                />
                <div>
                  <Typography color="blue-gray" variant="h6">
                    {user && user.username}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {user && user.email}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form encType="multipart/form-data" method="POST">
                  <input
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImage}
                    type="file"
                    id="icon-button-file"
                  />
                  {uploading ? (
                    <Spinner className="h-8 w-8" />
                  ) : auth.isAuthenticated() &&
                    auth.isAuthenticated().user._id === user._id ? (
                    <label htmlFor="icon-button-file">
                      <Button
                        variant="text"
                        size="sm"
                        className="border-gray-300 flex items-center gap-2"
                        onClick={() =>
                          document.getElementById("icon-button-file").click()
                        }
                      >
                        <ArrowUpTrayIcon
                          strokeWidth={2}
                          className="h-6 w-6 text-gray-500"
                        />
                        Upload Avatar
                      </Button>
                    </label>
                  ) : (
                    <Button
                      variant="text"
                      size="sm"
                      className="border-gray-300 flex items-center gap-2"
                      onClick={() => {
                        if (auth.isAuthenticated()) {
                          accessChat();
                        } else {
                          navigate(`/sign-in`);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      Message
                    </Button>
                  )}
                </form>
              </div>
            </div>
            <Typography
              variant="small"
              className="font-normal text-gray-600 mt-6"
            >
              {user && user.bio}
            </Typography>
            <div className="flex gap-4">
              <Typography variant="small" className="font-normal mt-6">
                {Object.keys(usersPosts).length +
                  ` ${Object.keys(usersPosts).length > 1 ? `Posts` : `Post`}`}
              </Typography>
              <Typography variant="small" className="font-normal mt-6">
                {Object.keys(ratings).length +
                  ` ${Object.keys(ratings).length > 1 ? `Ratings` : `Rating`}`}
              </Typography>
            </div>
          </CardBody>
        </Card>
        <Tabs value="ratings">
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 mt-2"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </section>
  );
};
