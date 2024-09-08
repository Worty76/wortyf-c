import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { create } from "./DiscussionsApi";
import auth from "../../helpers/Auth";
import { Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: "0 auto",
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  addButton: {
    marginLeft: theme.spacing(2),
  },
}));

export default function CreatePost() {
  const classes = useStyles();
  const [values, setValues] = useState({
    title: "",
    description: "",
    content: "",
    error: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [topics, setTopics] = useState([]);
  const [selectTopics, setSelectTopics] = useState([]);
  const [images, setImages] = useState([]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`http://localhost:8000/api/topic`, {
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

  const handleVariant = (variant) => {
    enqueueSnackbar("Successfully created a post", { variant });
  };

  const handleImage = (e) => {
    const files = e.target.files;
    let updatedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.preview = URL.createObjectURL(file);
      updatedImages.push(file);
    }
    setImages((prevImages) => [...prevImages, ...updatedImages]);
  };

  const handleSelectingOptions = (event) => {
    const {
      target: { value },
    } = event;
    setSelectTopics(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getTopics(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  const onSubmit = () => {
    let postData = new FormData();
    values.title && postData.append("title", values.title);
    values.description && postData.append("description", values.description);
    values.content && postData.append("content", values.content);
    images && images.forEach((image) => postData.append("images", image));
    selectTopics && postData.append("topic", selectTopics);

    create(
      {
        t: JSON.parse(auth.isAuthenticated().token),
      },
      postData
    ).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.error.message });
      } else {
        const postId = JSON.parse(data)._id;
        Navigate(`/discussions/${postId}`);
        handleVariant("success");
      }
    });
  };

  return (
    <div>
      <Paper className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.formItem}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              onChange={handleChange("title")}
              value={values.title}
            />
          </Grid>
          <Grid item xs={12} className={classes.formItem}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              onChange={handleChange("description")}
              value={values.description}
            />
          </Grid>
          <Grid item xs={12} className={classes.formItem}>
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              onChange={handleChange("content")}
              value={values.content}
            />
          </Grid>
          <Grid item xs={12} className={classes.formItem}>
            <FormControl fullWidth>
              <InputLabel>Topics</InputLabel>
              <Select
                multiple
                value={selectTopics}
                onChange={handleSelectingOptions}
                input={<OutlinedInput label="Topics" />}
              >
                {topics.map((topic, id) => (
                  <MenuItem key={id} value={topic.name}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.formItem}>
            <input
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={(e) => handleImage(e)}
              type="file"
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <Button variant="contained" component="span">
                Add Images
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} className={classes.submitButton}>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Submit Post
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
