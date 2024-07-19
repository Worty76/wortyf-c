import { Box } from "@mui/material";
import { ListItemText } from "@mui/material";

const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <Box
      sx={{
        padding: 1,
        display: "flex",
        alignItems: "center",
        color: "black",
        borderRadius: "10",
      }}
    >
      <Box>
        <ListItemText
          sx={{ cursor: "pointer" }}
          onClick={handleFunction}
          primary={user.username + " X"}
        />
      </Box>
    </Box>
  );
};

export default UserBadgeItem;
