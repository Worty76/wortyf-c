import { Avatar, Typography, Card } from "@material-tailwind/react";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Card
      onClick={handleFunction}
      className="cursor-pointer w-full flex items-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all my-2"
    >
      <div className="flex items-center">
        <Avatar
          src={user.avatar_url}
          alt={`${user.username}'s avatar`}
          size="sm"
          className="mr-4"
        />
        <div>
          <Typography variant="h6" className="font-bold text-sm">
            {user.username}
          </Typography>
          <Typography variant="small" className="text-gray-500 text-sm">
            {user.email}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default UserListItem;
