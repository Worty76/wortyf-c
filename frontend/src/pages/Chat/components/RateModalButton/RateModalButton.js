import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField, Typography } from "@mui/material";
import { rate } from "../../api/ChatApi";
import auth from "../../../../helpers/Auth";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  marginTop: 2,
  backgroundColor: "#007bff",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
};

function RateModalButton({ chat }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [totalStars, setTotalStars] = useState(5);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!rating) errors.name = "This is required.";
    return errors;
  };

  const onRate = () => {
    let errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    rate(
      {
        postId: chat.post._id,
        buyerId: chat.post.buyer._id,
        sellerId: chat.post.author._id,
        noOfStars: rating,
        comment: comment,
      },
      {
        t: JSON.parse(auth.isAuthenticated().token),
      }
    ).then((data) => {
      if (data.stack) {
        console.log(data);
      } else {
        navigate(0);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Rate
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Rate
          </Typography>
          <div
            style={{
              textAlign: "center",
            }}
          >
            {[...Array(totalStars)].map((star, index) => {
              const currentRating = index + 1;

              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    style={{ display: "none" }}
                    value={currentRating}
                    required
                    onChange={() => setRating(currentRating)}
                  />
                  <span
                    className="star"
                    style={{
                      cursor: "pointer",
                      fontSize: "2rem",
                      margin: "5px",
                      color:
                        currentRating <= (hover || rating)
                          ? "#ffc107"
                          : "#e4e5e9",
                    }}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  >
                    &#9733;
                  </span>
                </label>
              );
            })}
          </div>
          <Typography sx={{ textAlign: "center", color: "red" }}>
            {errorMessages.name}
          </Typography>
          <TextField
            id="comment"
            label="Write your comment here"
            variant="standard"
            fullWidth
            margin="normal"
            onChange={(e) => setComment(e.target.value)}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}></Box>
          <Button sx={buttonStyle} onClick={onRate} variant="contained">
            Done
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RateModalButton;
