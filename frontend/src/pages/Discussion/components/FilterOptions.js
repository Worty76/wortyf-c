import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
import MultiRangeSlider from "./MultiRangeSlider/MultiRangeSlider";

const FilterOptions = ({
  open,
  searchParams,
  setPosts,
  setCurrentPage,
  setPageNumbers,
}) => {
  const [filterOption, setFilterOption] = useState(null);
  const [sortedOption, setSortedOption] = useState(null);
  const [range, setRange] = useState({});
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
        : ""
    }${
      range.min !== undefined && range.max !== undefined
        ? `${
            tag !== "" ||
            filterBy[filterOption] !== undefined ||
            sortedBy[sortedOption] !== undefined ||
            name !== ""
              ? "&"
              : ""
          }range=${encodeURIComponent(JSON.stringify(range))}`
        : ""
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
    <div className="w-full flex flex-col p-4 bg-white shadow-lg rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <fieldset className="border-t border-gray-300">
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Filter By
            </legend>
            {filterBy.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={index === filterOption}
                  onChange={() => handleFilterBy(index)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-gray-700">{option.title}</label>
              </div>
            ))}
          </fieldset>
        </div>

        <div>
          <fieldset className="border-t border-gray-300">
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Sort By
            </legend>
            {sortedBy.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={index === sortedOption}
                  onChange={() => handleSortedBy(index)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-gray-700">{option.title}</label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col gap-2">
          <Input
            name="searchTag"
            type="search"
            label="Search (e.g. fashion, phone)"
            className="w-full p-2 border rounded-md border-gray-300 "
            onChange={handleTag}
          />
          <Input
            name="searchName"
            type="search"
            label="Search name (e.g. iphone16, laptop...)"
            className="w-full p-2 border rounded-md border-gray-300"
            onChange={handleName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <MultiRangeSlider min={0} max={900000000} setRange={setRange} />
          <Button
            id="find"
            className="text-white py-2 px-4 rounded-md w-full"
            onClick={handleSearch}
          >
            Find
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
