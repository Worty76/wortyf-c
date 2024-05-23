import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "300px",
    backgroundColor: "#24292F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        style={{
          width: "90%",
          height: "200px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "500px" }}>
          <List>
            <ListItemText
              primary={
                <Typography
                  sx={{ color: "white", textAlign: "center" }}
                  variant="h5"
                >
                  <b>WORTY-F</b>
                </Typography>
              }
              secondary={
                <Typography style={{ color: "white", textAlign: "center" }}>
                  <i>"A new strong platform."</i>
                </Typography>
              }
            />
            <ListItem>
              <div style={{ margin: "0 auto" }}>
                <ListItemIcon>
                  <IconButton href="https://www.facebook.com/w0rzt/">
                    <FacebookIcon sx={{ color: "white" }} />
                  </IconButton>
                  <IconButton href="https://www.instagram.com/wortttttz/">
                    <InstagramIcon sx={{ color: "white" }} />
                  </IconButton>
                  <IconButton>
                    <TwitterIcon sx={{ color: "white" }} />
                  </IconButton>
                </ListItemIcon>
              </div>
            </ListItem>
            {/* <ListItem>
              <ListItemText
                primary={
                  <Typography sx={{ color: "white", textAlign: "center" }}>
                    Let's build a strong community 🚀
                  </Typography>
                }
              />
            </ListItem> */}
            <br /> <br />
            <Divider style={{ backgroundColor: "white" }} />
            <ListItem>
              <ListItemText
                primary={
                  <Typography sx={{ color: "white", textAlign: "center" }}>
                    <b>
                      <a
                        href="https://www.facebook.com/w0rzt/"
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        &copy; Worty (Le Thanh Dat)
                      </a>
                    </b>{" "}
                    2022-2023
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  );
}
