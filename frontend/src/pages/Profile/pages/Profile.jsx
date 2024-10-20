import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import auth from "../../../helpers/Auth";
import { changeAvatar } from "../../Auth/api/authApi";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { Topic } from "../../Discussion/components/Topic";
import { Stars } from "../components/Stars";
import { Markup } from "interweave";
import { updateBio } from "../api/profileApi";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { CardReview } from "../components/CardReview";

import {
  StarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Post } from "../../Discussion/components/Post";
import Information from "../components/Information";

export const Profile = () => {
  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { setSelectedChat, chats, setChats } = ChatState();
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

  const handleSave = () => {
    console.log(updatedFields);
    updateBio(
      { t: JSON.parse(auth.isAuthenticated().token) },
      updatedFields
    ).then((data) => setUser(JSON.parse(data)));
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
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const response = await changeAvatar(
        { id: params.id },
        { t: JSON.parse(auth.isAuthenticated().token) },
        imageData
      );
      console.log(response);
      auth.updateAvatarUrl(JSON.parse(response));
      setUploadSuccess(true);
      window.location.reload(true);
    } catch (error) {
      setUploadError(error.message);
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
      navigate("/chat");
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

  const CONTENTS = [
    {
      title: "This tool has made my workflow seamless",
      name: "Ryan Samuel",
      feedback:
        "I've been using this for a while now, and it's become an essential part of my daily routine. It's incredibly user-friendly and has greatly improved my productivity.",
      date: "03 March 2024",
    },
    {
      title: "It's made my job so much easier",
      name: "Emma Roberts",
      feedback:
        "This tool has been a game-changer for me. From managing my tasks to collaborating with my team, it's made everything so much easier. Highly recommended!",
      date: "14 February 2023",
    },
    {
      title: "It's my go-to solution for staying organized.",
      name: "Bruce Mars",
      feedback:
        "I've been using this for a while now, and it's become an essential part of my daily routine. It's incredibly user-friendly and has greatly improved my productivity.",
      date: "10 February 2023",
    },
  ];

  const data = [
    {
      label: "Ratings",
      value: "ratings",
      icon: StarIcon,
      desc: (
        <div className="mt-5">
          {CONTENTS.map(({ name, feedback, title, date }, index) => (
            <CardReview
              key={index}
              title={title}
              name={name}
              feedback={feedback}
              date={date}
            />
          ))}
        </div>
      ),
    },
    {
      label: "Posts",
      value: "posts",
      icon: UserCircleIcon,
      desc: (
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-8">
          {usersPosts.map((post, key) => (
            <Post
              key={key}
              id={post._id}
              name={post.name}
              date={post.createdAt}
              authorName={post.author.username}
              imgs={post.images}
              profileImg={post.author.avatar_url}
            />
          ))}
        </CardBody>
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

  console.log(updatedFields);
  return (
    <section className="p-8">
      <div className="container mx-auto max-w-screen-lg">
        <Card shadow={false} className="border border-gray-300 rounded-2xl">
          <CardBody>
            <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar_url} alt="avatar" variant="rounded" />
                <div>
                  <Typography color="blue-gray" variant="h6">
                    {user.username}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {user.email}
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
                  ) : (
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
                  )}
                </form>
              </div>
            </div>
            <Typography
              variant="small"
              className="font-normal text-gray-600 mt-6"
            >
              {user.bio}
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
