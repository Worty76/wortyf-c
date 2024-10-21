import { XMarkIcon } from "@heroicons/react/24/solid"; // Example using Heroicons

const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <div
      className="flex items-center p-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
      onClick={handleFunction}
    >
      <img
        src={user.avatar_url}
        alt={`${user.username}'s avatar`}
        className="w-10 h-10 rounded-full mr-2 object-cover"
      />
      <span className="text-sm font-medium">{user.username}</span>
      <XMarkIcon className="w-5 h-5 ml-2 text-gray-600" />
    </div>
  );
};

export default UserBadgeItem;
