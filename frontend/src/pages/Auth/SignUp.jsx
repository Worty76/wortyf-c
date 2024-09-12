import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "./authApi";
import { VariantType, useSnackbar } from "notistack";

export default function SignUp() {
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

  // const renderError = () => {
  //   return (
  //     <div style={{ width: "100%", textAlign: "center" }}>{values.error}</div>
  //   );
  // };

  const onSignUp = () => {
    let user = new FormData();
    values.username && user.append("username", values.username);
    values.age && user.append("age", values.age);
    values.gender && user.append("gender", values.gender);
    values.email && user.append("email", values.email);
    values.from && user.append("from", values.from);
    values.password && user.append("password", values.password);

    if (values.password !== values.passwordConfirmed) {
      setValues({
        ...values,
        error: "Password and PasswordConfirmed is not match!",
        redirect: false,
      });
    }

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={handleChange("username")}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="number"
                required
                fullWidth
                id="age"
                onChange={handleChange("age")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <Select value={values.gender} onChange={handleChange("gender")}>
                  <MenuItem value="true">Male</MenuItem>
                  <MenuItem value="false">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="from"
                label="From"
                id="from"
                onChange={handleChange("from")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="passwordConfirmed"
                label="passwordConfirmed"
                type="password"
                id="passwordConfirmed"
                onChange={handleChange("passwordConfirmed")}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={onSignUp}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography component={Link} to="/signin">
                Already have an account? Sign in
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
