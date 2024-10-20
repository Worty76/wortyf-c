// eslint-disable-next-line
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import axios from "axios";
import auth from "../../../helpers/Auth";
import { useNavigate } from "react-router-dom";
import { Topic } from "../components/Topic";
import { Markup } from "interweave";
import FilterOptions from "../components/FilterOptions";
import FilterListIcon from "@mui/icons-material/FilterList";
import Pagination from "../components/Pagination";
import { Post } from "../components/Post";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { CardBody, Typography, Button } from "@material-tailwind/react";

export const Discussions = ({
  posts,
  setPosts,
  loading,
  pageNumbers,
  currentPage,
  pages,
  setCurrentPage,
  setPageNumbers,
  handlePageChange,
}) => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpen = () => {
    navigate("/home/create");
  };

  const handleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/topic`, {
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
    // eslint-disable-next-line
  }, []);

  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <div className="my-4">
          <img
            className="h-96 w-full rounded-lg object-cover object-center"
            src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            alt="nature"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <Typography variant="h4">Our Product Categories</Typography>
            <Typography className="text-gray-500 !text-base !font-normal">
              Browse through our extensive selection and find exactly what
              you're looking for.
            </Typography>
          </div>
          <Button
            variant="text"
            className="flex items-center gap-2 p-2"
            size="sm"
            onClick={() => navigate(`/tags`)}
          >
            EXPLORE OTHER CATEGORIES
            <ChevronRightIcon strokeWidth={2} className="h-5 w-5" />
          </Button>
        </div>

        <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {topics &&
            topics.map((topic, index) => (
              <Topic
                color={topic.color}
                description={topic.description}
                name={topic.name}
                key={index}
                id={topic._id}
              />
            ))}
        </CardBody>

        <div className="flex justify-between items-center gap-2 my-6">
          <Button
            className="text-white px-4 py-2 rounded-md"
            onClick={handleFilter}
          >
            <FilterListIcon /> Filter
          </Button>
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleOpen}
          >
            Create Post
          </Button>
        </div>

        <div>
          {openFilter && (
            <FilterOptions
              open={openFilter}
              setCurrentPage={setCurrentPage}
              setPageNumbers={setPageNumbers}
              setPosts={setPosts}
            />
          )}
        </div>

        <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-8">
          {posts.map((post, key) => (
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

        <Pagination
          totalPages={pageNumbers}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};
