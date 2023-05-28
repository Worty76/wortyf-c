import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Paper, Typography } from "@mui/material";
import discussions from "../../../images/discussions.png";
import discussionDetails from "../../../images/discussionDetails.png";
import profile from "../../../images/profile.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    margin: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    position: "relative",
    paddingTop: "30px",
    paddingBottom: "20px",
  },
  container: {
    margin: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  leftArrow: {
    position: "absolute",
    top: "50%",
    left: "32px",
    fontSize: "3rem",
    color: "#000",
    zIndex: 10,
    cursor: "pointer",
    userSelect: "none",
  },
  rightArrow: {
    position: "absolute",
    top: "50%",
    right: "32px",
    fontSize: "3rem",
    color: "#000",
    zIndex: 10,
    cursor: "pointer",
    userSelect: "none",
  },
  slide: {
    opacity: 0,
    transitionDuration: "1s ease",
  },
  slideActive: {
    opacity: 1,
    transitionDuration: "1s",
    transform: "scale(1.08)",
  },
}));

const images = [
  {
    image: discussionDetails,
  },
  {
    image: discussions,
  },
  {
    image: profile,
  },
];
export default function PreviewContent() {
  const classes = useStyles();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const length = images.length;

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <div>
          <Typography variant="h6" textAlign={"center"}>
            Simple interfaces that I bring to users to have good experiences.
          </Typography>
        </div>
        <div className={classes.mainContainer}>
          <ArrowBackIosNewIcon
            className={classes.leftArrow}
            onClick={prevSlide}
          />
          {images.map((image, id) => {
            return (
              <Paper
                key={id}
                className={id === current ? classes.slideActive : classes.slide}
                elevation={6}
                sx={{ maxWidth: "80%" }}
              >
                <div>
                  {id === current && (
                    <img
                      src={image.image}
                      alt="interface"
                      style={{
                        width: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                      }}
                    />
                  )}
                </div>
              </Paper>
            );
          })}
          <ArrowForwardIosIcon
            className={classes.rightArrow}
            onClick={nextSlide}
          />
        </div>
      </div>
    </>
  );
}
