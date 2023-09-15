import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import data from "./data.json";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    position: "relative",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
}));

export default function Recommendations() {
  const classes = useStyles();
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <div style={{ paddingTop: "20px" }}>
          <Typography variant="h6" textAlign={"center"}>
            Read what our previous customers say.
          </Typography>
        </div>
        <div className={classes.root}>
          <Box>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {data.map((comment, id) => {
                return (
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
                                src={comment.avatar}
                                sx={{ width: "80px", height: "80px" }}
                              />
                            </ListItemAvatar>
                          </ListItem>
                          <ListItemText
                            primary={
                              <Typography>
                                <b>{comment.name}</b>
                              </Typography>
                            }
                            sx={{ textAlign: "center" }}
                          />
                          <ListItemText
                            primary={comment.position}
                            sx={{ textAlign: "center" }}
                          />
                          <Divider />
                        </List>
                        <List>
                          <ListItemText
                            primary={
                              <Typography>
                                <i>"{comment.comment}"</i>
                              </Typography>
                            }
                          />
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
}
