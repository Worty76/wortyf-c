import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { create } from "../api/DiscussionsApi";
import auth from "../../../helpers/Auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Input,
  Button,
  Select,
  Option,
  Spinner,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { SelectedTags } from "../components/SelectedTags";

export const CreatePost = () => {
  const [values, setValues] = useState({
    name: "",
    price: "",
    content: "",
    error: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [topics, setTopics] = useState([]);
  const [selectTopics, setSelectTopics] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (name) => (input) => {
    let value;

    if (input && input.target) {
      value = input.target.value;
    } else {
      value = input;
    }

    if (name === "price") {
      let numericValue = parseFloat(value.replace(/[^0-9]/g, ""));

      if (!isNaN(numericValue)) {
        value = numericValue.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      }

      setValues({
        ...values,
        [name]: value,
      });
      return;
    }
    setValues({ ...values, [name]: value });
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/topic`, { cancelToken: signal })
        .then((response) => {
          setTopics(response.data.data);
        })
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleImage = (e) => {
    const files = e.target.files;
    let updatedImages = [];

    if (files) {
      setImages([]);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        file.preview = URL.createObjectURL(file);
        updatedImages.push(file);
      }
      setImages((prevImages) => [...prevImages, ...updatedImages]);
    }
  };

  const handleSelectingOptions = (event) => {
    const value = event;
    if (selectTopics.includes(value)) {
      setSelectTopics((prevState) =>
        prevState.filter((state) => state !== value)
      );
    } else {
      setSelectTopics([...selectTopics, value]);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getTopics(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  const validateForm = () => {
    let errors = {};
    if (!values.name) errors.name = "Name is required.";
    if (values.name.length < 11 || values.name.length > 50)
      errors.name = "Name should be more than 10 or less than 50 characters.";
    if (!values.price) errors.price = "Price is required.";
    if (images.length === 0) errors.image = "Select at least 1 image";
    console.log(images);
    return errors;
  };

  const onSubmit = () => {
    let errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setLoading(true);

    let postData = new FormData();
    values.name && postData.append("name", values.name);
    values.price && postData.append("price", values.price);
    values.content && postData.append("content", values.content);
    const date = new Date();
    postData.append("date", date);
    images && images.forEach((image) => postData.append("images", image));
    selectTopics && postData.append("topic", selectTopics);

    create(
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      postData
    ).then((data) => {
      setLoading(false);
      if (data.stack) {
        console.log(data);
      } else {
        const postId = JSON.parse(data)._id;
        navigate(`/post/${postId}`);
        enqueueSnackbar("Successfully created a post", { variant: "success" });
      }
    });
  };

  const handleAddImagesClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <div className="p-6 rounded-lg bg-white">
          <h2 className="text-2xl font-semibold mb-6">Create a New Post</h2>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <Input
                type="text"
                id="name"
                className="input input-bordered w-full"
                placeholder="Summarize your problem in one line"
                onChange={handleChange("name")}
                error={errorMessages.name}
                value={values.name}
                aria-label="Name"
              />
              {errorMessages.name && (
                <p className="text-red-500">{errorMessages.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Price
              </label>
              <Input
                type="text"
                id="price"
                className="input input-bordered w-full"
                placeholder="Your price"
                onChange={handleChange("price")}
                value={values.price}
                error={errorMessages.price}
                aria-label="Price"
              />
              {errorMessages.price && (
                <p className="text-red-500">{errorMessages.price}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="content"
              >
                Content
              </label>
              <Textarea
                id="content"
                variant="outlined"
                rows={8}
                onChange={handleChange("content")}
              />
            </div>
            {console.log(values)}
            <div className="flex gap-2">
              {selectTopics !== "" &&
                topics.map((topic, id) =>
                  selectTopics.includes(topic.name) ? (
                    <SelectedTags key={id} name={topic.name} id={topic._id} />
                  ) : (
                    ""
                  )
                )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Topics</label>
              <Select
                multiple
                variant="outlined"
                className="select select-bordered w-full"
                onChange={handleSelectingOptions}
                value={selectTopics}
              >
                {topics.map((topic, id) => (
                  <Option
                    key={id}
                    value={topic.name}
                    className={`${
                      selectTopics.includes(topic.name) ? "bg-gray-300" : ""
                    }`}
                  >
                    {topic.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImage}
              />
              <Button
                onClick={handleAddImagesClick}
                htmlFor="image-upload"
                className="btn btn-primary"
              >
                Add Images
              </Button>
              {!errorMessages.image ? (
                <Typography className="text-normal mt-2 text-gray-500">
                  *Select at least 1 image
                </Typography>
              ) : (
                <Typography className="text-normal mt-2 text-red-500">
                  *Select at least 1 image
                </Typography>
              )}
            </div>

            <div className="columns-4 gap-5">
              {images &&
                images.map((img, id) => (
                  <img
                    key={id}
                    alt="img"
                    className="w-44 h-auto object-contain rounded-md"
                    src={img.preview}
                  />
                ))}
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <Button className="btn btn-primary w-full" onClick={onSubmit}>
                  Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
