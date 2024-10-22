import { Typography } from "@material-tailwind/react";

export const SelectedTags = ({ name, description, id, removeSelectedTag }) => {
  return (
    <div>
      <Typography variant="small" className="font-medium text-blue-500">
        #{name}
      </Typography>
    </div>
  );
};
