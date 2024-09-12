import { Avatar, AvatarGroup } from "@mui/material";

export default function TotalAvatars({ props }) {
  const length = Object.keys(props).length;

  return (
    <AvatarGroup total={length}>
      {props.map((prop, id) => (
        <Avatar
          key={id}
          src={`http://localhost:8000/${prop.author.avatar_url}`}
        />
      ))}
    </AvatarGroup>
  );
}
