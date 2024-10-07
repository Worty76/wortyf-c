import React, { useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import auth from "../helpers/Auth";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../logic/ChatLogics";

export const Appbar = () => {
  const user = auth.isAuthenticated().user;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line
  const { setSelectedChat, notification, setNotification, setIsLoggedIn } =
    ChatState();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const pages = {
    user: [
      { name: "Home", URL: "home" },
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
    ],
    admin: [
      { name: "Home", URL: "home" },
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
      { name: "Manage", URL: "admin/manage" },
    ],
    moderator: [
      { name: "Home", URL: "home" },
      { name: "Guardians", URL: "guardians" },
      { name: "Events", URL: "events" },
      { name: "Chat", URL: "chat" },
      { name: "In approval", URL: "moderator/approve" },
    ],
  };

  return (
    <div>
      <AppBar
        position="static"
        color="primary"
        elevation={1}
        sx={{ zIndex: 999 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Put logo */}
            <Typography
              variant="h6"
              sx={{
                textDecoration: "none",
                color: "white",
                fontWeight: 700,
                outline: "none",
              }}
              component={Link}
              to="/"
            >
              Worty-F
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {user &&
                  user.role === "user" &&
                  pages.user.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                {user &&
                  user.role === "admin" &&
                  pages.admin.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                {user &&
                  user.role === "moderator" &&
                  pages.moderator.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                },
                paddingLeft: "10px",
              }}
            >
              {(!user || user.role === "user" || user.role === "guardian") &&
                pages.user.map((page) => (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{
                      color: window.location.pathname.includes(page.URL)
                        ? "grey"
                        : "white",
                      display: "block",
                      "&:hover": {
                        backgroundColor: window.location.pathname.includes(
                          page.URL
                        )
                          ? "#24292F"
                          : "grey",
                      },
                      textAlign: "center",
                    }}
                    component={Link}
                    to={`${page.URL}`}
                  >
                    {page.name}
                  </Button>
                ))}

              {user &&
                user.role === "admin" &&
                pages.admin.map((page) => (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{
                      color: window.location.pathname.includes(page.URL)
                        ? "grey"
                        : "white",
                      display: "block",
                      "&:hover": {
                        backgroundColor: window.location.pathname.includes(
                          page.URL
                        )
                          ? "#24292F"
                          : "grey",
                      },
                      textAlign: "center",
                    }}
                    component={Link}
                    to={`${page.URL}`}
                  >
                    {page.name}
                  </Button>
                ))}

              {user &&
                user.role === "moderator" &&
                pages.moderator.map((page) => (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{
                      color: window.location.pathname.includes(page.URL)
                        ? "grey"
                        : "white",
                      display: "block",
                      "&:hover": {
                        backgroundColor: window.location.pathname.includes(
                          page.URL
                        )
                          ? "#24292F"
                          : "grey",
                      },
                      textAlign: "center",
                    }}
                    component={Link}
                    to={`${page.URL}`}
                  >
                    {page.name}
                  </Button>
                ))}
            </Box>

            {/* Notification Icon */}
            <div style={{ padding: 10 }}>
              <IconButton size="small" color="inherit" onClick={handleClick}>
                <Badge badgeContent={notification.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 400,
                    width: 300,
                  },
                }}
              >
                <div style={{ padding: 5 }}>
                  <b>New Messages</b>
                </div>
                <div style={{ padding: 5 }}>
                  {!notification.length && "No New Messages"}
                  {notification?.map((noti, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        setSelectedChat(noti.chat);
                        setNotification(
                          notification.filter(
                            (n) => n.chat._id !== noti.chat._id
                          )
                        );
                        navigate("/chat");
                      }}
                    >
                      {noti.chat.isGroupChat
                        ? `New Message in ${noti.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            noti.chat.users
                          )}`}
                    </MenuItem>
                  ))}
                </div>
              </Menu>
            </div>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user ? <Avatar src={user.avatar_url} /> : <Avatar />}
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <div>
                    <MenuItem
                      component={Link}
                      to={`/profile/${user._id}`}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        auth.clearJwt(() => navigate("/sign-in"));
                        navigate(0);
                        setIsLoggedIn(false);
                      }}
                    >
                      <Typography>Logout</Typography>
                    </MenuItem>
                  </div>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/sign-in"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">Sign in</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};
