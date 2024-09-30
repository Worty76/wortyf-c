import React from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

export const GuardiansList = ({ guardians }) => {
  const placeholderAvatar = "/path/to/placeholder_avatar.png"; // Replace with your placeholder image path

  return (
    <div>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {guardians.map((guardian) => (
            <Grid item xs={12} sm={6} md={4} key={guardian._id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  boxShadow: 3,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar
                  src={
                    guardian.avatar_url
                      ? `http://localhost:8000/${guardian.avatar_url}`
                      : placeholderAvatar
                  }
                  alt={guardian.username}
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    border: "2px solid #1976d2",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {guardian.username}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    Email: {guardian.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {guardian.from}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};
