import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, MenuItem, Select } from "@mui/material";
import axios from "axios";
import auth from "../../../../../helpers/Auth";

export const DataTable = () => {
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 300 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    { field: "from", headerName: "From", width: 300 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.role}
          onChange={(e) => handleRoleChange(e, params.row._id)}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="guardian">Guardian</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  const [users, setUsers] = useState([]);

  const getUsers = async (signal) => {
    try {
      await axios
        .get("http://localhost:8000/api/user/users", {
          cancelToken: signal,
        })
        .then((response) => {
          setUsers(response.data.data);
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

  const handleRoleChange = async (event, id) => {
    const updatedRole = event.target.value;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, role: updatedRole } : user
      )
    );

    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/update-role/${id}`,
        {
          role: updatedRole,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(auth.isAuthenticated().token),
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getUsers(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 15, 20]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};
