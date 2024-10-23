import React, { useState } from "react";
import { rate } from "../../api/ChatApi";
import auth from "../../../../helpers/Auth";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Typography,
} from "@material-tailwind/react";

function RateModalButton({ chat }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const totalStars = 5;
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!rating) errors.rating = "This is required.";
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
    <>
      <Button onClick={handleOpen} variant="text">
        Rate
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Rate</DialogHeader>
        <DialogBody>
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
          <Typography className="text-base text-red-500 text-center">
            {" "}
            {errorMessages.rating && errorMessages.rating}
          </Typography>
          <Typography>Your message</Typography>
          <Textarea
            label="Message"
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={onRate}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default RateModalButton;
