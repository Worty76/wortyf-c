import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  IconButton,
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import auth from "../../../helpers/Auth";

export const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", description: "" });
  const [editTag, setEditTag] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const user = auth.isAuthenticated().user;

  const getTags = async (signal) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/topic/all`,
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
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(auth.isAuthenticated().token),
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/topic/create`,
        newTag,
        config
      );
      setTags([...tags, response.data.data]);
      setNewTag({ name: "", description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const updateTag = async () => {
    try {
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(auth.isAuthenticated().token),
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/topic/update/${editTag._id}`,
        editTag,
        config
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
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(auth.isAuthenticated().token),
        },
      };
      await axios.delete(
        `${process.env.REACT_APP_API}/api/topic/delete/${id}`,
        config
      );
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
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <div className="bg-white shadow-none p-4 m-4">
          <Typography variant="h4" className="text-xl mb-4">
            Tags
          </Typography>

          {user && user.role === "moderator" ? (
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-5">
                <Input
                  label="Tag Name"
                  type="text"
                  value={newTag.name}
                  onChange={(e) =>
                    setNewTag({ ...newTag, name: e.target.value })
                  }
                  fullWidth
                />
              </div>
              <div className="col-span-12 md:col-span-5">
                <Input
                  label="Tag Description"
                  type="text"
                  value={newTag.description}
                  onChange={(e) =>
                    setNewTag({ ...newTag, description: e.target.value })
                  }
                  fullWidth
                />
              </div>
              <div className="col-span-12 md:col-span-2">
                <Button fullWidth onClick={createTag} color="blue">
                  Create Tag
                </Button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {tags &&
              tags.map((tag) => (
                <div key={tag._id} className="col-span-auto">
                  <Card className="border border-gray-300 overflow-hidden shadow-sm h-full cursor-pointer">
                    <CardBody className="p-4 flex flex-col h-full">
                      <div className="flex-grow">
                        <Typography
                          color="blue-gray"
                          className="!text-base !font-semibold mb-1 flex justify-between"
                        >
                          {tag.name}
                          {user && user.role === "moderator" && (
                            <>
                              <div className="flex gap-2">
                                <IconButton
                                  variant="text"
                                  onClick={() => handleEditClick(tag)}
                                  size="sm"
                                  color="blue"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton
                                  onClick={() => deleteTag(tag._id)}
                                  size="sm"
                                  color="red"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </IconButton>
                              </div>
                            </>
                          )}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-medium"
                        >
                          {tag.description}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
          </div>

          {editTag && (
            <Dialog open={isDialogOpen} handler={() => setDialogOpen(false)}>
              <DialogHeader>Edit Tag</DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                <Input
                  label="Tag Name"
                  value={editTag.name}
                  onChange={(e) =>
                    setEditTag({ ...editTag, name: e.target.value })
                  }
                  className="mb-4"
                  fullWidth
                />
                <Input
                  label="Tag Description"
                  type="text"
                  value={editTag.description}
                  onChange={(e) =>
                    setEditTag({ ...editTag, description: e.target.value })
                  }
                  fullWidth
                />
              </DialogBody>
              <DialogFooter className="flex gap-2">
                <Button onClick={() => setDialogOpen(false)} color="red">
                  Cancel
                </Button>
                <Button onClick={updateTag} color="blue">
                  Update
                </Button>
              </DialogFooter>
            </Dialog>
          )}
        </div>
      </div>
    </section>
  );
};
