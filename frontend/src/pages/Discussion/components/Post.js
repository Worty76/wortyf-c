import {
  Card,
  Avatar,
  Button,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function Post({ id, name, date, imgs, authorName, profileImg }) {
  const navigate = useNavigate();
  return (
    <Card className="border border-gray-300 overflow-hidden shadow-sm h-full">
      <CardBody className="p-4 flex flex-col h-full">
        <div className="flex-grow">
          <Typography
            color="blue-gray"
            className="!text-base !font-semibold mb-1"
          >
            {name}
          </Typography>
          <Typography variant="small" color="gray" className="font-medium">
            {moment(new Date(date)).fromNow()}
          </Typography>

          <div className="my-4 flex items-start justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar src={profileImg} alt={name} />
              <div>
                <Typography color="blue-gray" variant="h6">
                  {authorName}
                </Typography>
              </div>
            </div>
            <Button
              size="sm"
              variant="outlined"
              className="border-gray-300"
              onClick={() => navigate(`/post/${id}`)}
            >
              see more
            </Button>
          </div>
        </div>

        <div className="">
          {imgs && imgs.length > 0 && (
            <img
              src={imgs[0]}
              className="h-32 w-full object-cover rounded-xl"
              alt={`product`}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
