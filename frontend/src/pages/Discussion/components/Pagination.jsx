import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        siblingCount={1}
        boundaryCount={1}
        shape="rounded"
        variant="outlined"
        color="primary"
      />
    </Stack>
  );
};

export default PaginationComponent;
