import { Avatar, AvatarGroup } from "@mui/material";

export default function TotalAvatars({ props }) {
  const length = Object.keys(props).length;

  return (
    <AvatarGroup total={length}>
      {props.map((prop, id) => (
        <Avatar
          key={id}
          src={"data:image/jpeg;base64," + prop.author.avatar_url.data}
        />
      ))}
    </AvatarGroup>
  );
}
