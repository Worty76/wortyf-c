import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export const Topic = ({ name, description, color, id }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="border border-gray-300 overflow-hidden shadow-sm h-full cursor-pointer hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300"
      onClick={() => navigate(`/tag/${id}`)}
    >
      <CardBody className="p-4 flex flex-col h-full">
        <div className="flex-grow">
          <Typography
            color="blue-gray"
            className="!text-base !font-semibold mb-1"
          >
            {name}
          </Typography>
          <Typography variant="small" color="gray" className="font-medium">
            {description}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};
