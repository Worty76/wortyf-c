import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Typography,
  CardBody,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import { Post } from "../../Discussion/components/Post";
import FilterOptions from "../components/FilterOptions";

export const Tag = () => {
  const { id } = useParams();
  const [tag, setTag] = useState({});
  const [posts, setPosts] = useState([]);
  const [pageNumbers, setPageNumbers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const filters = params.get("filters");
  const sort = params.get("sort");
  const tagParams = params.get("tag");
  const name = params.get("name");
  let searchParams = `${
    tagParams !== null ? `tag=${encodeURIComponent(tagParams)}` : ""
  }${
    filters !== null
      ? tagParams === null
        ? `filters=${filters}`
        : `&filters=${filters}`
      : ""
  }${
    sort !== null
      ? tagParams !== null || filters !== null
        ? `&sort=${sort}`
        : `sort=${sort}`
      : ""
  }${
    name !== null
      ? tagParams !== "" || filters !== undefined || sort !== undefined
        ? `&name=${encodeURIComponent(name)}`
        : `name=${encodeURIComponent(name)}`
      : ``
  }`;

  const handleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const getTag = async (page, signal) => {
    try {
      const pageParam = currentPage ? `&page=${currentPage}` : "";
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/topic/${id}?${searchParams}${pageParam}`,
        {
          cancelToken: signal,
        }
      );
      console.log(response.data);
      setTag(response.data.topic);
      setPosts(response.data.posts);
      setPageNumbers(response.data.pages);
      setCurrentPage(response.data.current);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const pageFromUrl = params.get("page");
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    getTag(currentPage, source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate({
      pathname: `/tag/${id}`,
      search: `?page=${newPage}${searchParams ? `&${searchParams}` : ""}`,
    });
  };

  const nextPage = () => {
    if (currentPage < pageNumbers) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <section className="p-8">
      <div className="mx-auto max-w-screen-lg">
        <Typography variant="h4">{tag.name}</Typography>
        <Typography variant="h6" className="font-normal">
          {tag.description}
        </Typography>
        <div className="gap-2 my-6">
          <Button
            className="text-white rounded-md flex items-center gap-2"
            size="sm"
            onClick={handleFilter}
          >
            <AdjustmentsHorizontalIcon strokeWidth={2} className="h-6 w-6 " />
            Filter
          </Button>
        </div>

        {openFilter && (
          <FilterOptions
            open={openFilter}
            setPosts={setPosts}
            setCurrentPage={setCurrentPage}
            setPageNumbers={setPageNumbers}
            id={id}
          />
        )}

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

        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageNumbers }, (_, index) => index + 1).map(
              (page) => (
                <IconButton
                  key={page}
                  variant={currentPage === page ? "filled" : "text"}
                  color={currentPage === page ? "blue" : "gray"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </IconButton>
              )
            )}
          </div>

          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={nextPage}
            disabled={currentPage === pageNumbers}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
