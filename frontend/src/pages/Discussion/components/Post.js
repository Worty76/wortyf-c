import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function Post({ id, name, price, date, imgs, authorName, profileImg }) {
  const navigate = useNavigate();
  return (
    <Card
      className="border border-gray-300 overflow-hidden shadow-sm h-full cursor-pointer hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300"
      onClick={() => navigate(`/post/${id}`)}
    >
      <CardBody className="p-4 flex flex-col h-full gap-2">
        <div className="flex-grow">
          <Typography
            color="blue-gray"
            className="!text-base !font-semibold mb-1 line-clamp-2"
          >
            {name}
          </Typography>
          <Typography variant="small" color="gray" className="font-medium">
            {moment(new Date(date)).fromNow()}
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="font-bold text-red-500"
          >
            {price &&
              price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
          </Typography>

          {/* <div className="my-4 flex items-start justify-between items-center">
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
          </div> */}
        </div>

        <div>
          {imgs && imgs.length > 0 && (
            <img
              src={imgs[0]}
              className={`h-24 md:h-32 w-full object-cover rounded-xl`}
              alt={`product`}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
