import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, ListItem, ListItemText, Typography } from "@mui/material";
import { GuardiansList } from "../components/GuardiansList";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    padding: "1%",
    width: "95%",
    margin: "0 auto",
  },
});

export const Guardian = () => {
  const classes = useStyles();

  const [guardians, setGuardians] = useState([]);

  const getGuardians = async (signal) => {
    try {
      await axios
        .get("http://localhost:8000/api/user/guardians", {
          cancelToken: signal,
        })
        .then((response) => {
          setGuardians(response.data.data);
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getGuardians(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(guardians);

  return (
    <div className={classes.root}>
      <div>
        {/* Container */}
        <Box>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="h5" color={"variant"}>
                  List of Guardians
                </Typography>
              }
              secondary={
                "If you wan't to be a guardian, contact lethanhdat762003@gmail.com and i'll give you permissions"
              }
            />
          </ListItem>
          <ListItem>
            <GuardiansList guardians={guardians} />
          </ListItem>
        </Box>
      </div>
    </div>
  );
};
