import React, { useEffect, useState } from "react";
import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { signIn } from "../api/authApi";
import auth from "../../../helpers/Auth";
import { ChatState } from "../../../context/ChatProvider";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

export const SignIn = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const { setIsLoggedIn } = ChatState();

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
          setIsLoggedIn(true);
        });
      }
    });
  };

  const redirectToSignUp = () => {
    navigate("/sign-up");
  };

  useEffect(() => {
    if (redirect) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, [redirect]);

  return (
    <section className="grid text-center h-5/6 items-center p-8">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
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
              onChange={handleChange("email")}
            />
          </div>
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
              onChange={handleChange("password")}
            />
          </div>
          <Button
            color="gray"
            size="lg"
            className="mt-6"
            fullWidth
            onClick={onSignIn}
          >
            sign in
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>
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
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Not registered?{" "}
            <span
              className="font-medium text-gray-900 cursor-pointer hover:text-green-300"
              onClick={() => redirectToSignUp()}
            >
              Create account
            </span>
          </Typography>
        </form>
      </div>
    </section>
  );
};
