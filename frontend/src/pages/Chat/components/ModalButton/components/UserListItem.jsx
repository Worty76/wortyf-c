import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
    >
      <Avatar
        src={`${process.env.REACT_APP_API}/${user.avatar_url}`}
        alt={`${user.username}'s avatar`} // Added alt text for accessibility
        sx={{ width: 48, height: 48, marginRight: 2 }} // Adjusted size and margin
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body1"
          component="span"
          sx={{ fontWeight: "bold" }}
        >
          {user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="span">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
