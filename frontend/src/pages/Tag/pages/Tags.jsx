import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chip,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import auth from "../../../helpers/Auth";

export const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", color: "#000000" });
  const [editTag, setEditTag] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const user = auth.isAuthenticated().user;

  const getTags = async (signal) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/topic/`,
        {
          cancelToken: signal,
        }
      );
      setTags(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const createTag = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/topic/create`,
        newTag
      );
      setTags([...tags, response.data.data]);
      setNewTag({ name: "", color: "#000000" });
    } catch (error) {
      console.error(error);
    }
  };

  const updateTag = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/topic/update/${editTag._id}`,
        editTag
      );
      setTags(
        tags.map((tag) => (tag._id === editTag._id ? response.data.data : tag))
      );
      setEditTag(null);
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTag = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/topic/delete/${id}`);
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getTags(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  const handleEditClick = (tag) => {
    setEditTag(tag);
    setDialogOpen(true);
  };

  return (
    <Paper elevation={0} sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tags
      </Typography>

      {user.role === "moderator" ? (
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Tag Name"
              fullWidth
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              type="color"
              label="Tag Color"
              fullWidth
              value={newTag.color}
              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={createTag}
            >
              Create Tag
            </Button>
          </Grid>
        </Grid>
      ) : null}

      <Grid container spacing={2}>
        {tags &&
          tags.map((tag) => (
            <Grid item key={tag._id}>
              <Chip
                label={tag.name}
                style={{ backgroundColor: tag.color }}
                clickable
                variant="outlined"
              />
              {user.role === "moderator" ? (
                <>
                  {" "}
                  <IconButton
                    onClick={() => handleEditClick(tag)}
                    size="small"
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteTag(tag._id)}
                    size="small"
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : null}
            </Grid>
          ))}
      </Grid>

      {editTag && (
        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogContent>
            <TextField
              label="Tag Name"
              fullWidth
              value={editTag.name}
              onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="color"
              label="Tag Color"
              fullWidth
              value={editTag.color}
              onChange={(e) =>
                setEditTag({ ...editTag, color: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={updateTag} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};
