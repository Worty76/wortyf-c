export const Stars = ({ noOfStars }) => {
  const totalStars = 5;

  return [...Array(totalStars)].map((star, index) => (
    <label key={index}>
      <span
        className="star"
        style={{
          cursor: "pointer",
          fontSize: "2rem",
          margin: "5px",
          color: index + 1 < noOfStars ? "#ffc107" : "#e4e5e9",
        }}
      >
        &#9733;
      </span>
    </label>
  ));
};
