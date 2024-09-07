import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(-5),
    display: "flex",
    height: "100vh",
    width: "100%",
  },
  leftContainer: {
    minWidth: "50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    minWidth: "50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    padding: theme.spacing(1.5, 3),
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function Head() {
  const classes = useStyles();

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/home");
  };

  return (
    <div className={classes.root}>
      {/* Left container */}
      <div className={classes.leftContainer}>
        <Box
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Typography variant="h5">
              This is <b>Worty-F</b> <br /> A commerce created by{" "}
              <b>
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                  href="https://www.facebook.com/w0rzt/"
                >
                  Worty
                </a>
              </b>{" "}
              to build a helpful community.
            </Typography>
            <p>
              A place where people can share their ideas, opinions to help each
              other.
            </p>
            <Button className={classes.button} variant="contained" onClick={handleNavigation}>
              Join now
            </Button>
          </div>
        </Box>
      </div>
      {/* Right container */}
      <div className={classes.rightContainer}>
        <Box
          sx={{
            width: "700px",
            height: "700px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src="https://parentportfolio.com/wp-content/uploads/2022/11/640-two-hands-exchanging-money-next-to-house-model-laptop-and-stacks-of-coins.jpg"
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                borderRadius: "10px",
                width: "90%",
              }}
              alt="rightImageContainer"
            />
          </div>
        </Box>
      </div>
    </div>
  );
}
