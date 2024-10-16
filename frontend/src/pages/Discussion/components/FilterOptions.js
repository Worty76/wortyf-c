import {
  Paper,
  Button,
  List,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Grid,
  ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const FilterOptions = ({
  open,
  searchParams,
  setPosts,
  setCurrentPage,
  setPageNumbers,
}) => {
  const [filterOption, setFilterOption] = useState(null);
  const [sortedOption, setSortedOption] = useState(null);
  const [tag, setTag] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const filterBy = [
    { title: "Not sold", value: "NotSold" },
    { title: "No comments", value: "NoComments" },
  ];
  const sortedBy = [
    { title: "Newest", value: "Newest" },
    { title: "Oldest", value: "Oldest" },
    { title: "Most likes", value: "MostLikes" },
  ];

  const handleFilterBy = (i) => {
    setFilterOption((prev) => (i === prev ? null : i));
  };

  const handleSortedBy = (i) => {
    setSortedOption((prev) => (i === prev ? null : i));
  };

  const handleTag = (e) => {
    setTag(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleSearch = async () => {
    let searchParams;
    searchParams = `${
      tag !== "" ? `tag=${encodeURIComponent(tag.trim())}` : ""
    }${
      filterBy[filterOption] !== undefined
        ? tag === ""
          ? `filters=${filterBy[filterOption].value}`
          : `&filters=${filterBy[filterOption].value}`
        : ""
    }${
      sortedBy[sortedOption] !== undefined
        ? tag !== "" || filterBy[filterOption] !== undefined
          ? `&sort=${sortedBy[sortedOption].value}`
          : `sort=${sortedBy[sortedOption].value}`
        : ""
    }${
      name !== ""
        ? tag !== "" ||
          filterBy[filterOption] !== undefined ||
          sortedBy[sortedOption] !== undefined
          ? `&name=${encodeURIComponent(name)}`
          : `name=${encodeURIComponent(name)}`
        : ``
    }`;
    navigate(`/home?${searchParams}`);
    await axios
      .get(`${process.env.REACT_APP_API}/api/post/home?${searchParams}`)
      .then((res) => {
        console.log(res);
        setCurrentPage(res.data.current);
        setPageNumbers(res.data.pages);
        setPosts(res.data.data);
      });
  };

  return (
    <List>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={2} sx={{ marginBottom: 2, padding: 2 }}>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Filter By</FormLabel>
              {filterBy.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={index === filterOption}
                      onChange={() => handleFilterBy(index)}
                    />
                  }
                  label={option.title}
                />
              ))}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sort By</FormLabel>
              {sortedBy.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={index === sortedOption}
                      onChange={() => handleSortedBy(index)}
                    />
                  }
                  label={option.title}
                />
              ))}
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ padding: 2 }}>
          <Grid item xs={12} sm={8}>
            <ListItem>
              <TextField
                type="search"
                label="Search (e.g. fashion, phone)"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => handleTag(e)}
              />
            </ListItem>
            <ListItem>
              <TextField
                type="search"
                label="Search name"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => handleName(e)}
              />
            </ListItem>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button variant="contained" fullWidth onClick={handleSearch}>
              Find
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </List>
  );
};

export default FilterOptions;
