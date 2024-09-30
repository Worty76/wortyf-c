import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import auth from "../../../helpers/Auth";

const BackgroundImage = styled(Box)(({ theme }) => ({
  backgroundImage:
    "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  maxWidth: 400,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    maxWidth: "90%",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.dark,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const SignUp = () => {
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
  const { redirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    console.log(values);
  };

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
        setValues({ ...values, error: data.response.data.message });
      } else {
        let user = JSON.parse(data.user);
        auth.authenticate(user, data.token, () => {
          setValues({ ...values, redirect: true });
        });
      }
    });
  };

  useEffect(() => {
    if (redirect) {
      navigate("/home");
    }
  }, [redirect, navigate]);

  return (
    <BackgroundImage>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <FormContainer elevation={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
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
                  <StyledTextField
                    label="Age"
                    type="number"
                    fullWidth
                    id="age"
                    onChange={handleChange("age")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Select
                      value={values.gender}
                      onChange={handleChange("gender")}
                    >
                      <MenuItem value="true">Male</MenuItem>
                      <MenuItem value="false">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={handleChange("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    name="from"
                    label="From"
                    id="from"
                    onChange={handleChange("from")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
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
                  <StyledTextField
                    required
                    fullWidth
                    name="re-password"
                    label="Re-password"
                    type="password"
                    id="re-password"
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
                  <Typography
                    component={Link}
                    to="/signin"
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "black",
                      "&:hover": {
                        color: "gray",
                      },
                      transition: "ease 0.2s",
                    }}
                  >
                    Already have an account? Sign in
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </FormContainer>
      </Container>
    </BackgroundImage>
  );
};
