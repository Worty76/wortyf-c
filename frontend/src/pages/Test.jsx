import React, { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

export const Test = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  return (
    <section className="p-8">
      <div className="mx-auto max-w-screen-lg">
        <Typography variant="h4">Our Product Categories</Typography>
        <Typography variant="small" className="text-gray-500 text-normal">
          Browse through our extensive selection and find exactly what you're
          looking for.
        </Typography>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
          <Card className="border border-gray-300 overflow-hidden shadow-sm h-full">
            <CardBody className="p-4 flex flex-col h-full">
              <div className="flex-grow">
                <Typography
                  color="blue-gray"
                  className="!text-base !font-semibold mb-1"
                >
                  Electronics
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-medium"
                >
                  Smartphones, Laptops, Cameras, Accessories
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-300 overflow-hidden shadow-sm h-full">
            <CardBody className="p-4 flex flex-col h-full">
              <div className="flex-grow">
                <Typography
                  color="blue-gray"
                  className="!text-base !font-semibold mb-1"
                >
                  Fashion
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-medium"
                >
                  Men's Clothing, Women's Clothing, Shoes
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-300 overflow-hidden shadow-sm h-full">
            <CardBody className="p-4 flex flex-col h-full">
              <div className="flex-grow">
                <Typography
                  color="blue-gray"
                  className="!text-base !font-semibold mb-1"
                >
                  Home & Kitchen
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-medium"
                >
                  Furniture, Appliances, Cookware, Home Decor
                </Typography>
              </div>
            </CardBody>
          </Card>
        </CardBody>
      </div>
    </section>
  );
};
