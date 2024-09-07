import {
  Modal,
  Box,
  List,
  ListItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 450,
    backgroundColor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: theme.shape.borderRadius,
  },
  submitButton: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
}));

const MyModal = ({
  open,
  handleOpen,
  handleChange,
  selectTopics,
  handleSelectingOptions,
  topics,
  onSubmit,
  values,
  renderError,
  setImages,
}) => {
  const classes = useStyles();

  const handleImage = (e) => {
    const files = e.target.files; // Get the list of selected files
    let updatedImages = []; // Temporary array to hold the new images

    // Loop through all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file[i]); // You can log each file name to confirm

      // Append each file to FormData
      // Preview the selected image (optional)
      file.preview = URL.createObjectURL(file);

      // Add file to the updated images array
      updatedImages.push(file);
    }

    // Update the state with the new files, appending to existing images
    setImages((prevImages) => [...prevImages, ...updatedImages]);
  };

  return (
    <Modal
      open={open}
      onClose={handleOpen}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className={classes.modalBox}>
        <List>
          <ListItem>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontWeight: 300, width: "100%" }}
              id="modal-title"
            >
              There are many people waiting for your new question
            </Typography>
          </ListItem>
          <ListItem>
            <TextField
              label="Title"
              variant="outlined"
              id="title"
              onChange={handleChange("title")}
              fullWidth
            />
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              id="description"
              onChange={handleChange("description")}
            />
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              label="Content"
              variant="outlined"
              id="content"
              onChange={handleChange("content")}
            />
          </ListItem>
          <ListItem>
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
          </ListItem>
          <ListItem>
            <form encType="multipart/form-data" method="POST">
              <input
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleImage(e);
                }}
                type="file"
                name="myFile"
                id="icon-button-file"
              />
              <label htmlFor="icon-button-file">
                <Button
                  sx={{ margin: "0 auto" }}
                  variant="contained"
                  component="span"
                >
                  Add Images
                </Button>
              </label>
            </form>
          </ListItem>
        </List>
        <Box className={classes.submitButton}>
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
        {values.error && renderError()}
      </Box>
    </Modal>
  );
};

export default MyModal;
