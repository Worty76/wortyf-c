import { Box, Avatar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <Box
      sx={{
        padding: 1,
        display: "flex",
        alignItems: "center",
        borderRadius: 1,
        backgroundColor: "#f5f5f5",
        transition: "background-color 0.3s",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
      onClick={handleFunction}
    >
      <Avatar
        src={`${process.env.REACT_APP_API}/${user.avatar_url}`}
        alt={`${user.username}'s avatar`} // Added alt text for accessibility
        sx={{ width: 40, height: 40, marginRight: 2 }} // Adjusted size and margin
      />
      <Typography variant="body1" component="span">
        {user.username}
      </Typography>
      <CloseIcon />
    </Box>
  );
};

export default UserBadgeItem;
