import React from "react";
import { makeStyles } from "@mui/styles";
import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";
import { Badge, ListItem, ListItemText, Typography } from "@mui/material";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "50px",
    backgroundColor: "#24292F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
  },
});

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        {/* Copyright */}
        <ListItem>
          <Badge>
            <CopyrightOutlinedIcon sx={{ color: "white" }} />
          </Badge>
          <ListItemText
            primary={
              <Typography color={"white"} sx={{ paddingLeft: "10px" }}>
                This website is created by{" "}
                <b>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      outline: "none",
                    }}
                    href="https://www.facebook.com/w0rzt/"
                  >
                    Worty (Le Thanh Dat)
                  </a>
                </b>{" "}
                with
                <b> React 🚀</b>
              </Typography>
            }
          />
        </ListItem>
      </div>
    </div>
  );
}
