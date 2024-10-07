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
                          src={`http://localhost:8000/${guardian.avatar_url}`}
                          sx={{ width: "80px", height: "80px" }}
                        />
                      </ListItemAvatar>
                    </ListItem>
                    <ListItemText
                      primary={
                        <Typography>
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
                    <ListItemText
                      primary={
                        <Typography>
                          <i>"{""}"</i>
                        </Typography>
                      }
                    />
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
