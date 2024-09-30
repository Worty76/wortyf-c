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
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line
  const { setSelectedChat, notification, setNotification } = ChatState();
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

  const pages = [
    { name: "Home", URL: "home" },
    { name: "Guardians", URL: "guardians" },
    { name: "Events", URL: "events" },
    // { name: "ChatGPT", URL: "chatgpt" },
    { name: "Chat", URL: "chat" },
  ];

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
                {pages.map((page) => (
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
              {pages.map((page) => (
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
                  {notification?.map((noti) => (
                    <MenuItem
                      key={noti.id}
                      onClick={() => {
                        setSelectedChat(noti.chat);
                        setNotification(notification.filter((n) => n !== noti));
                        navigate("/chat");
                      }}
                    >
                      {noti.chat.isGroupChat
                        ? `New Message in ${noti.chat.chatName}`
                        : `New Message from ${getSender(
                            auth.isAuthenticated().user,
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
                  {auth.isAuthenticated().user ? (
                    <Avatar
                      src={`http://localhost:8000/${
                        auth.isAuthenticated().user.avatar_url
                      }`}
                    />
                  ) : (
                    <Avatar />
                  )}
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
                {auth.isAuthenticated().user ? (
                  <div>
                    <MenuItem
                      component={Link}
                      to={`/profile/${auth.isAuthenticated().user._id}`}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        auth.clearJwt(() => navigate("/"));
                      }}
                    >
                      <Typography>Logout</Typography>
                    </MenuItem>
                  </div>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/signin"
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
