import {
  Avatar,
  Box,
} from "../../../../../../node_modules/@material-ui/core/index";
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
      <Avatar src={user.avatar_url} sx={{ cursor: "pointer" }} size={"sm"} />
      <Box>
        <ListItemText primary={user.username} />
        <ListItemText primary={user.email} />
      </Box>
    </Box>
  );
};

export default UserListItem;
