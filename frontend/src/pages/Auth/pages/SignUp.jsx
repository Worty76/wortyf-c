import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import auth from "../../../helpers/Auth";
import { ChatState } from "../../../context/ChatProvider";
import {
  Typography,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

export const SignUp = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    age: "",
    gender: "male",
    email: "",
    from: "",
    password: "",
    passwordConfirmed: "",
    error: "",
    redirect: false,
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [errors, setErrors] = useState({});
  const { redirect } = values;

  const { setIsLoggedIn } = ChatState();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = values.username ? "" : "Username is required.";
    tempErrors.username =
      values.username.length > 15 || values.username.length < 6
        ? "Username must be more than 6 characters and less than 15 characters."
        : "";
    tempErrors.age =
      values.age && values.age > 0
        ? ""
        : "Age is required and must be a positive number.";
    tempErrors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)
      ? ""
      : "Email is not valid.";
    tempErrors.password = values.password ? "" : "Password is required.";
    tempErrors.passwordConfirmed =
      values.passwordConfirmed === values.password
        ? ""
        : "Passwords do not match.";

    setErrors({ ...tempErrors });
    return Object.values(tempErrors).every((x) => x === "");
  };

  console.log(values);

  const onSignUp = () => {
    if (!validate()) return; // Prevent submission if validation fails

    let user = new FormData();
    values.username && user.append("username", values.username);
    values.age && user.append("age", values.age);
    values.gender && user.append("gender", values.gender);
    values.email && user.append("email", values.email);
    values.from && user.append("from", values.from);
    values.password && user.append("password", values.password);

    signUp(user).then((data) => {
      if (data.stack) {
        setValues({ ...values, error: data.response.data.message });
      } else {
        let user = JSON.parse(data.user);
        auth.authenticate(user, data.token, () => {
          setValues({ ...values, redirect: true });
        });
        setIsLoggedIn(true);
      }
    });
  };

  useEffect(() => {
    if (redirect) {
      navigate("/home");
    }
  }, [redirect, navigate]);

  return (
    <section className="grid text-center h-5/6 items-center p-8">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign Up
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your details to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left space-y-6">
          {/* Username */}
          <div className="mb-6">
            <label htmlFor="username">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Username
              </Typography>
            </label>
            <Input
              id="username"
              color="gray"
              size="lg"
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          {/* Age */}
          <div className="mb-6">
            <label htmlFor="age">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Age
              </Typography>
            </label>
            <Input
              id="age"
              color="gray"
              size="lg"
              type="number"
              name="age"
              placeholder="Enter your age"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label htmlFor="gender">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Gender
              </Typography>
            </label>
            <Select
              id="gender"
              name="gender"
              label="Select gender"
              className="w-full px-4 py-2 border-t-blue-gray-200 focus:border-t-primary text-gray-600 rounded-lg"
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          {/* From */}
          <div className="mb-6">
            <label htmlFor="from">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Location
              </Typography>
            </label>
            <Input
              id="from"
              color="gray"
              size="lg"
              type="text"
              name="from"
              placeholder="Enter your location"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="passwordConfirmed">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Confirm Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>

          <Button color="gray" size="lg" className="mt-6" fullWidth>
            sign up
          </Button>

          <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            sign in with google
          </Button>

          {/* Create Account */}
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Already have account?{" "}
            <a href="#" className="font-medium text-gray-900">
              Sign in
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
};
