import React from "react";
import {
  Input,
  Typography,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import auth from "../../../helpers/Auth";

function Information({
  bio,
  username,
  gender,
  from,
  phone,
  user,
  handleFieldChange,
  handleSave,
}) {
  return (
    <section className="px-8 container mx-auto">
      <div className="flex flex-col mt-8">
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Bio
            </Typography>
            {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id ? (
              <Input
                name="bio"
                size="lg"
                placeholder="Bio"
                value={bio}
                onChange={handleFieldChange}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            ) : (
              <Typography>{bio}</Typography>
            )}
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Username
            </Typography>
            {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id ? (
              <Input
                name="username"
                size="lg"
                placeholder="Emma"
                onChange={(e) => handleFieldChange(e)}
                value={username}
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            ) : (
              <Typography>{username}</Typography>
            )}
          </div>
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Gender
            </Typography>
            {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id ? (
              <Select
                name="gender"
                size="lg"
                onChange={(value) =>
                  handleFieldChange({ target: { name: "gender", value } })
                }
                className="border-t-blue-gray-200 aria-[expanded=true]:border-t-primary"
                value={gender}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            ) : (
              <Typography>
                {gender === "male" && "Male"}
                {gender === "female" && "Female"}
                {gender === "other" && "Other"}
              </Typography>
            )}
          </div>
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Location
            </Typography>
            {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id ? (
              <Input
                size="lg"
                name="from"
                value={from}
                onChange={handleFieldChange}
                placeholder="Florida, USA"
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            ) : (
              <Typography>{from ? from : "Unknown"}</Typography>
            )}
          </div>
          <div className="w-full">
            <Typography
              name="phone"
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              Phone Number
            </Typography>
            {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id ? (
              <Input
                size="lg"
                name="phone"
                value={phone}
                onChange={handleFieldChange}
                placeholder="+123 0123 456 789"
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              />
            ) : (
              <Typography>{phone ? phone : "Unknown"}</Typography>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div></div>
          {auth.isAuthenticated() &&
          auth.isAuthenticated().user._id === user._id ? (
            <Button color="green" onClick={handleSave}>
              Update
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Information;
