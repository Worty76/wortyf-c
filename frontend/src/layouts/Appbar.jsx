import React, { useState, forwardRef } from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  HomeIcon,
  XMarkIcon,
  Bars3Icon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, Link } from "react-router-dom";
import auth from "../helpers/Auth";

const NAV_MENU = [
  {
    name: "Home",
    icon: HomeIcon,
    url: "/home",
  },
  {
    name: "Pages",
    icon: RectangleStackIcon,
  },
];

const NavItem = forwardRef(({ children, onClick, href }, ref) => (
  <Typography
    variant="paragraph"
    color="gray"
    className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer"
    onClick={onClick}
    ref={ref}
  >
    {children}
  </Typography>
));

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const ProfileMenu = ({ isMenuOpen, setIsMenuOpen, closeMenu, user }) => {
  const navigate = useNavigate();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full py-0 pr-0 pl-0 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src={user && user.avatar_url}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => {
                if (label === "My Profile") {
                  navigate(`/profile/${user._id}`);
                }
                if (label === "Sign Out") {
                  auth.clearJwt(() => {
                    navigate(`sign-in`);
                  });
                  navigate(0);
                }
                closeMenu();
              }}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export const Appbar = () => {
  const user = auth.isAuthenticated().user;
  const [open, setOpen] = useState(false);
  const [openPagesMenu, setOpenPagesMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);

  const pages = {
    user: [
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
    ],
    admin: [
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
      { name: "Manage", URL: "admin/manage" },
    ],
    moderator: [
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
      { name: "In approval", URL: "moderator/approve" },
      { name: "Reports", URL: "moderator/report" },
      { name: "Tags", URL: "tags" },
    ],
  };

  const getPagesForRole = () => {
    if (user && user.role === "admin") return pages.admin;
    if (user && user.role === "moderator") return pages.moderator;
    return pages.user;
  };

  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50">
      <div className="relative container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <Typography
            component={Link}
            onClick={() => navigate("/")}
            color="blue-gray"
            className="text-lg font-bold cursor-pointer"
          >
            WortyF
          </Typography>
        </div>

        <ul className="flex-1 hidden items-center gap-8 lg:flex w-full justify-center">
          {NAV_MENU.map(({ name, icon: Icon, url }) =>
            name === "Pages" ? (
              <Menu
                key={name}
                open={openPagesMenu}
                handler={setOpenPagesMenu}
                placement="bottom-start"
                offset={10}
              >
                <MenuHandler>
                  <NavItem onClick={() => setOpenPagesMenu((prev) => !prev)}>
                    <Icon className="h-5 w-5" />
                    {name}
                  </NavItem>
                </MenuHandler>
                <MenuList className="z-50">
                  {getPagesForRole().map((page) => (
                    <MenuItem
                      key={page.name}
                      onClick={() => {
                        navigate(`/${page.URL}`);
                        setOpenPagesMenu(false);
                      }}
                    >
                      {page.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <NavItem key={name} onClick={() => navigate(url)}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            )
          )}
        </ul>

        <div className="flex-1 hidden items-center gap-2 lg:flex justify-end">
          {!user && (
            <>
              <Button variant="text" onClick={() => navigate(`/sign-in`)}>
                Sign In
              </Button>

              <Button
                color="gray"
                className="bg-primary"
                onClick={() => navigate(`/sign-up`)}
              >
                Sign Up
              </Button>
            </>
          )}
          {user && (
            <ProfileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              closeMenu={closeMenu}
              user={user}
            />
          )}
        </div>

        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon }) => (
              <NavItem key={name}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <Button variant="text">Sign In</Button>

            <Button color="gray">Sign Up</Button>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
};
