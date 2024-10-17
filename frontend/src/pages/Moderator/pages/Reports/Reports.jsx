import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  CardContent,
  Typography,
  Paper,
  List,
  CircularProgress,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PostIcon from "@mui/icons-material/Description";
import auth from "../../../../helpers/Auth";

const useStyles = makeStyles({
  root: {
    width: "95%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  reportList: {
    width: "100%",
  },
  reportCard: {
    margin: "10px 0",
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: "15px",
  },
  loading: {
    marginTop: "20px",
  },
  noReports: {
    marginTop: "20px",
  },
  content: {
    flexGrow: 1,
  },
  iconButton: {
    marginLeft: "auto",
  },
});

export const Reports = () => {
  const classes = useStyles();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getReports = async (signal) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: signal,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/report`,
        config
      );
      setReports(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getReports(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  if (loading) {
    return <CircularProgress className={classes.loading} />;
  }

  return (
    <div className={classes.root}>
      <List className={classes.reportList}>
        {reports.length === 0 ? (
          <Typography className={classes.noReports}>
            No reports available.
          </Typography>
        ) : (
          reports.map((report) => (
            <Box
              key={report._id}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/post/${report.postId._id}`)}
            >
              <Paper className={classes.reportCard} elevation={3}>
                <Avatar
                  className={classes.avatar}
                  src={report.author.avatar_url}
                >
                  <PersonIcon />
                </Avatar>
                <CardContent className={classes.content}>
                  <Typography variant="h6">
                    Message: {report.message}
                  </Typography>
                  <Typography variant="body2">
                    <PersonIcon fontSize="small" /> Author:{" "}
                    {report.author.username}
                  </Typography>
                  <Typography variant="body2">
                    <PostIcon fontSize="small" /> Post name:{" "}
                    {report.postId.name}
                  </Typography>
                </CardContent>
              </Paper>
            </Box>
          ))
        )}
      </List>
    </div>
  );
};
