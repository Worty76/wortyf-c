export default function BestAnswer() {
  return (
    <div
      style={{
        borderRadius: "50px",
        backgroundColor: "#fd900133",
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
          color: "#d43f03",
          fontWeight: "700",
        }}
      >
        Sold
      </div>
    </div>
  );
}
