import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "./authApi";
import { VariantType, useSnackbar } from "notistack";

const useStyles = makeStyles({
  root: {
    padding: "5%",
  },
  Container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 900,
    height: 600,
    margin: "0 auto",
  },
});

export default function SignUp() {
  const classes = useStyles();

  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    age: "",
    gender: false,
    email: "",
    from: "",
    password: "",
    passwordConfirmed: "",
    error: "",
    redirect: false,
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleVariant = (variant: VariantType) => {
    enqueueSnackbar("Successfully did an action", { variant });
  };

  const { redirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (redirect) {
    return navigate("/signin");
  }

  const renderError = () => {
    return (
      <div style={{ width: "100%", textAlign: "center" }}>{values.error}</div>
    );
  };

  const onSignUp = () => {
    let user = new FormData();
    values.username && user.append("username", values.username);
    values.age && user.append("age", values.age);
    values.gender && user.append("gender", values.gender);
    values.email && user.append("email", values.email);
    values.from && user.append("from", values.from);
    values.password && user.append("password", values.password);

    signUp(user).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.error });
      } else {
        handleVariant("success");
        setValues({ ...values, redirect: true });
      }
    });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.Container}>
        <List sx={{ width: "400px" }}>
          <ListItem>
            <ListItemText
              primary={<Typography variant="h5">Register 👌✌️</Typography>}
              secondary={"How do i get started ?"}
            />
          </ListItem>
          <ListItem>
            <TextField label="Username" onChange={handleChange("username")} />
            <TextField
              label="Email"
              onChange={handleChange("email")}
              sx={{ marginLeft: "10px" }}
            />
          </ListItem>

          <ListItem>
            <TextField
              label="Age"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange("age")}
              variant="filled"
            />
            <FormControl sx={{ marginLeft: "10px" }}>
              <InputLabel>Gender</InputLabel>
              <Select value={values.gender} onChange={handleChange("gender")}>
                <MenuItem value="true">Male</MenuItem>
                <MenuItem value="false">Female</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <TextField fullWidth label="From" onChange={handleChange("from")} />
          </ListItem>
          <ListItem>
            <TextField
              label="Password"
              onChange={handleChange("password")}
              type="password"
            />
            <TextField
              label="PasswordConfirmed"
              onChange={handleChange("passwordConfirmed")}
              style={{ marginLeft: "10px" }}
              type="password"
            />
          </ListItem>
          <ListItem></ListItem>
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={onSignUp}>
              Register
            </Button>
          </ListItem>
          <br />
          <Typography
            sx={{
              textDecoration: "none",
              color: "inherit",
              paddingLeft: "200px",
            }}
            component={Link}
            to="/signin"
          >
            Already have an account ?
          </Typography>
          <br />
          <Typography
            variant="h8"
            sx={{
              color: "red",
              position: "absolute",
            }}
          >
            {values.error ? renderError() : null}
          </Typography>
        </List>
      </Card>
    </div>
  );
}
