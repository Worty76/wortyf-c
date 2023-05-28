import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "./authApi";
import auth from "../../helpers/auth";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
  Container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 600,
    minHeight: 400,
    margin: "0 auto",
  },
});

export default function SignIn() {
  const classes = useStyles();

  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });

  const { redirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onSignIn = () => {
    let user = new FormData();
    values.email && user.append("email", values.email);
    values.password && user.append("password", values.password);

    signIn(user).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.message });
      } else {
        let user = JSON.parse(data.user);
        auth.authenticate(user, data.token, () => {
          setValues({ ...values, redirect: true });
        });
      }
    });
  };

  if (redirect) {
    window.location.reload(true);
    return navigate("/home");
  }

  const renderError = () => {
    return (
      <div style={{ width: "100%", textAlign: "center", color: "red" }}>
        {values.error}
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Card className={classes.Container}>
        <List>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h5">Login </Typography>}
              secondary={"How do i get started ?"}
            />
          </ListItem>
          <ListItem>
            <TextField label="Email" onChange={handleChange("email")} />
          </ListItem>
          <ListItem>
            <TextField
              label="Password"
              onChange={handleChange("password")}
              type="password"
            />
          </ListItem>
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={onSignIn}>
              Login
            </Button>
          </ListItem>
          <ListItem>
            <Typography
              sx={{
                textDecoration: "none",
                color: "inherit",
                paddingLeft: "30px",
              }}
              component={Link}
              to="/signup"
            >
              Don't have an account?
            </Typography>
          </ListItem>
          <br />
          <Typography
            variant="h8"
            sx={{
              color: "red",
              position: "absolute",
            }}
          ></Typography>
          {values.error ? renderError() : null}
        </List>
      </Card>
    </div>
  );
}
