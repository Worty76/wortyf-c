export const Topic = ({ name, color, id }) => {
  return (
    <div
      style={{
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        border: `1px solid ${color}`,
        margin: 5,
        cursor: "pointer",
      }}
      key={id}
    >
      <div
        style={{
          fontSize: "clamp(0.7rem, 5vw, 0.3rem)",
          color: `${color}`,
          fontWeight: "700",
          padding: 5,
        }}
      >
        {name}
      </div>
    </div>
  );
};
