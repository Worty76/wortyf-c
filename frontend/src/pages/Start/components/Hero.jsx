import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Typography } from "@material-tailwind/react";

export default function Hero() {
  // eslint-disable-next-line
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  const handleNavigation = () => {
    navigate("/home");
  };

  return (
    <header className="bg-white p-8">
      <div className="grid mt-16 min-h-[82vh] w-full lg:h-[54rem] md:h-[34rem] place-items-stretch bg-center bg-contain bg-no-repeat">
        <div className="container mx-auto px-4 text-center">
          <Typography className="inline-flex text-xs rounded-lg border-[1.5px] border-blue-gray-50 bg-white py-1 lg:px-4 px-1 font-medium text">
            Exciting News! Introducing our latest version
          </Typography>
          <Typography
            variant="h1"
            color="blue-gray"
            className="mx-auto my-6 w-full leading-snug !text-2xl lg:max-w-3xl lg:!text-5xl"
          >
            Get ready to experience a new level of{" "}
            <span className="text-green-500 leading-snug ">performance</span>{" "}
            and{" "}
            <span className="leading-snug text-green-500">functionality</span>.
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto w-full !text-gray-500 lg:text-lg text-base"
          >
            The time is now for it to be okay to be great. For being a bright
            color. For standing out.
          </Typography>
          <div className="mt-8 grid w-full place-items-start md:justify-center">
            <div className="mb-2 flex w-full flex-col gap-4 md:flex-row">
              <Button
                color="gray"
                className="w-full px-4 md:w-[12rem]"
                onClick={handleNavigation}
              >
                get started
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:container lg:mx-auto">
        <img
          className="h-96 w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
          src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
          alt="nature"
        />
      </div>
    </header>
  );
}
