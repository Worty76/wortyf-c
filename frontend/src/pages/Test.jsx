import React, { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const messages = [
  {
    id: 1,
    sender: "Shanay Cruz",
    time: "05:14 PM",
    text: "Guts, I need a review of work. Are you ready?",
    avatar: "https://pagedone.io/asset/uploads/1710412177.png",
    isUser: false,
  },
  {
    id: 2,
    sender: "Shanay Cruz",
    time: "05:15 PM",
    text: "Let me know",
    avatar: "https://pagedone.io/asset/uploads/1710412177.png",
    isUser: false,
  },
  {
    id: 3,
    sender: "You",
    time: "05:16 PM",
    text: "Yes, let’s see, send your work here",
    avatar: "https://pagedone.io/asset/uploads/1704091591.png",
    isUser: true,
  },
  {
    id: 4,
    sender: "You",
    time: "05:17 PM",
    text: "Anyone on for lunch today?",
    avatar: "https://pagedone.io/asset/uploads/1704091591.png",
    isUser: true,
  },
];
export const Test = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg"></div>
    </section>
  );
};
