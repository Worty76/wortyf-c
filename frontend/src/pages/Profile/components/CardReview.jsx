import {
  Card,
  CardBody,
  Rating,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import moment from "moment";

export function CardReview({ name, feedback, date }) {
  return (
    <Card shadow={false}>
      <CardBody className="pt-0">
        <div className="flex gap-2 items-center my-3">
          <Avatar
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="avatar"
            variant="rounded"
          />
          <div className="items-center">
            <Typography variant="h6" color="blue-gray" className="font-medium">
              {name}
            </Typography>
            <Typography variant="small" className="font-normal !text-gray-500">
              {moment(new Date(date)).fromNow()}
            </Typography>
          </div>
        </div>
        <Rating value={4} className="text-amber-500" />

        <Typography className="text-base font-normal !text-gray-500">
          {feedback}
        </Typography>
      </CardBody>
    </Card>
  );
}
