import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, ListItem, ListItemText, Typography } from "@mui/material";

const useStyles = makeStyles({
  root: {
    padding: "1%",
    width: "95%",
    margin: "0 auto",
  },
});

export default function MidMans() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        {/* Container */}
        <Box>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="h5" color={"variant"}>
                  List of Midman
                </Typography>
              }
            />
          </ListItem>
        </Box>
      </div>
    </div>
  );
}
