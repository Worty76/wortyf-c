import { Avatar, Box } from "@mui/material";
import { ListItemText } from "@mui/material";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: "10",
      }}
    >
      <Avatar
        src={`http://localhost:8000/${user.avatar_url}`}
        sx={{ cursor: "pointer" }}
        size={"sm"}
      />
      <Box>
        <ListItemText primary={user.username} />
        <ListItemText primary={user.email} />
      </Box>
    </Box>
  );
};

export default UserListItem;
