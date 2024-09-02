import { Box } from "@mui/material";
import { List, Avatar, ListItemText, ListItem } from "@mui/material";

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
        <div style={{display: "flex", alignItems: "center"}}>
          <Avatar
            src={`http://localhost:8000/${user.avatar_url}`}
            sx={{ cursor: "pointer" }}
            onClick={handleFunction}
            size={"sm"}
          />
          <ListItemText
            sx={{ paddingLeft: "10px", cursor: "pointer" }}
            onClick={handleFunction}
            primary={user.username}
          />
        </div>
      </Box>
    </Box>
  );
};

export default UserBadgeItem;
