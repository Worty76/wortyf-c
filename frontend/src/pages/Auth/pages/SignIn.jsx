import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  styled,
  Paper,
  InputAdornment,
} from "@mui/material";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { signIn } from "../api/authApi";
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

export const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(false);
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

  const redirectToSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (redirect) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, [redirect]);

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
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Welcome to WortyF-C
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            color="textSecondary"
          >
            Please sign in to continue
          </Typography>
          <div>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope color="#1976d2" />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange("password")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <div>
              <Typography
                onClick={redirectToSignUp}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "gray",
                  },
                  transition: "ease 0.2s",
                }}
              >
                Don't have an account?
              </Typography>
            </div>
            <div style={{ color: "red", textAlign: "center" }}>
              {values.error}
            </div>

            <Button
              onClick={onSignIn}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                background: "#24292F",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              }}
            >
              Sign In
            </Button>
          </div>
        </FormContainer>
      </Container>
    </BackgroundImage>
  );
};
