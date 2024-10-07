import React from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Stars } from "../../Profile/components/Stars";
import { Link } from "react-router-dom";

export const GuardiansList = ({ guardians }) => {
  return (
    <div>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {guardians.map((guardian, id) => (
            <Grid item key={id}>
              <Card sx={{ width: "300px" }}>
                <CardContent>
                  <List>
                    <ListItem
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <ListItemAvatar
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Avatar
                          src={`${process.env.REACT_APP_API}/${guardian.avatar_url}`}
                          sx={{ width: "80px", height: "80px" }}
                        />
                      </ListItemAvatar>
                    </ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          component={Link}
                          to={`/profile/${guardian._id}`}
                          sx={{ textDecoration: "none", color: "black" }}
                        >
                          <b>{guardian.username}</b>
                        </Typography>
                      }
                      sx={{ textAlign: "center" }}
                    />
                    <ListItemText
                      primary={guardian.bio}
                      sx={{ textAlign: "center" }}
                    />
                    <Divider />
                  </List>
                  <List>
                    <Typography sx={{ textAlign: "center" }}>
                      <Stars noOfStars={guardian.avgRating} />
                    </Typography>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};
