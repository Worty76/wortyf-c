import React, { useEffect, useState } from "react";
import {
  Typography,
  CardBody,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import auth from "../../../../../helpers/Auth";
import moment from "moment";

const TABLE_HEAD = ["Member", "Role", "Status", "Joined on", ""];

const ROWS_PER_PAGE = 5;

export const DataTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingUserId, setEditingUserId] = useState(null);

  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);

  const currentTableRows = users.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getUsers = async (signal) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: signal,
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/user/admin/get-users`,
        config
      );
      setUsers(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleRoleChange = async (value, id) => {
    const updatedRole = value;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, role: updatedRole } : user
      )
    );

    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/user/update-role/${id}`,
        { role: updatedRole },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }

    setEditingUserId(null);
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getUsers(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  return (
    <CardBody className="overflow-scroll px-0">
      <table className="mt-4 w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="cursor-pointer p-4 transition-colors hover:bg-blue-gray-50"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTableRows.map(
            ({ _id, avatar_url, username, email, role, createdAt }, index) => {
              const isLast = index === currentTableRows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={_id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar src={avatar_url} alt={username} size="sm" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {username}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {email}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      {editingUserId === _id ? (
                        <div className="w-40">
                          <Select
                            label="Role"
                            onChange={(e) => handleRoleChange(e, _id)}
                            value={role}
                          >
                            <Option value="admin">Admin</Option>
                            <Option value="guardian">Guardian</Option>
                            <Option value="user">User</Option>
                            <Option value="moderator">Moderator</Option>
                          </Select>
                        </div>
                      ) : (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {role}
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className={classes}>
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={"offline"}
                      color={"blue-gray"}
                    />
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {moment(new Date(createdAt)).fromNow()}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Menu>
                      <MenuHandler>
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem onClick={() => setEditingUserId(_id)}>
                          Edit role
                        </MenuItem>
                        <MenuItem>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 0} onClick={handlePreviousPage}>
          Previous
        </Button>
        <Typography variant="small" className="text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button
          disabled={currentPage >= totalPages - 1}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
    </CardBody>
  );
};
