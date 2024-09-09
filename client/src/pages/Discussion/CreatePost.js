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
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { create } from "./DiscussionsApi";
import auth from "../../helpers/Auth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextEditor from "./components/TextEditor";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 900,
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
  card: {
    marginTop: theme.spacing(2),
  },
  stepper: {
    paddingBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
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
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const steps = [
    "Summarize your problem in one line",
    "Describe your problem in more detail",
    "Add tags and images",
    "Submit your post",
  ];

  const handleChange = (name) => (input) => {
    let value;

    if (input && input.target) {
      value = input.target.value;
    } else {
      value = input;
    }

    setValues({ ...values, [name]: value });
  };

  const getTopics = async (signal) => {
    try {
      await axios
        .get(`http://localhost:8000/api/topic`, { cancelToken: signal })
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

  const validateForm = () => {
    let errors = {};
    if (!values.title) errors.title = "Title is required.";
    if (!values.description) errors.description = "Description is required.";
    if (!values.content) errors.content = "Content is required.";
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
      setLoading(false);
      if (data.stack) {
        console.log(data);
      } else {
        const postId = JSON.parse(data)._id;
        navigate(`/discussions/${postId}`);
        enqueueSnackbar("Successfully created a post", { variant: "success" });
      }
    });
  };

  return (
    <div className={classes.root}>
      {/* Stepper at the top to guide user */}
      <Stepper className={classes.stepper} activeStep={-1}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Post Creation Form */}
      <Paper className={classes.section} elevation={2}>
        <Typography variant="h5" gutterBottom>
          Create a New Discussion Post
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.formItem}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              onChange={handleChange("title")}
              value={values.title}
              placeholder="Summarize your problem in one line"
              error={!!errorMessages.title}
              helperText={errorMessages.title || "Required field"}
              aria-label="Title"
            />
          </Grid>

          <Grid item xs={12} className={classes.formItem}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              onChange={handleChange("description")}
              value={values.description}
              placeholder="Describe your problem in detail"
              multiline
              minRows={3}
              error={!!errorMessages.description}
              helperText={errorMessages.description || "Required field"}
              aria-label="Description"
            />
          </Grid>

          <Grid item xs={12} className={classes.formItem}>
            <TextEditor
              placeholder={"Write your content here..."}
              setText={handleChange("content")}
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
                aria-label="Topics"
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
              onChange={handleImage}
              type="file"
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <Button variant="contained" component="span">
                Add Images
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sx={{}}>
            <div
              style={{
                alignItems: "center",
                flexFlow: "row wrap",
                display: "flex",
              }}
            >
              {images &&
                images.map((img, id) => (
                  <img
                    key={id}
                    alt="img"
                    style={{
                      width: "280px",
                      minHeight: "100%",
                      objectFit: "contain",
                      padding: 2,
                    }}
                    src={img.preview}
                  />
                ))}
            </div>
          </Grid>

          <Grid item xs={12} className={classes.submitButton}>
            {loading ? (
              <Box className={classes.loadingSpinner}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                fullWidth
              >
                Submit Post
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
