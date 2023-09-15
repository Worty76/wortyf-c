export default function BestAnswer() {
  return (
    <div
      style={{
        borderRadius: "50px",
        backgroundColor: "#dbffdc",
        width: "100px",
        height: "25px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          fontSize: "clamp(0.7rem, 5vw, 0.3rem)",
          color: "#38E54D",
          fontWeight: "700",
        }}
      >
        Best answer
      </div>
    </div>
  );
}
