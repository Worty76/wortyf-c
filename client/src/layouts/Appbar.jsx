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

export default function Appbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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

  const pages = [
    { name: "Home", URL: "home" },
    { name: "Midmans", URL: "midmans" },
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
                    color: "white",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "grey",
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
            <MenuItem>
              <IconButton size="small" color="inherit">
                <Badge badgeContent={14} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </MenuItem>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {auth.isAuthenticated().user ? (
                    <Avatar
                      alt={auth.isAuthenticated().user.username}
                      src={
                        `http://localhost:8000/` +
                        auth.isAuthenticated()?.user?.avatar_url
                      }
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
}
