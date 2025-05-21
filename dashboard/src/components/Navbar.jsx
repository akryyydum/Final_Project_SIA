// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar className="toolbar">
        <Typography variant="h6" className="logo" component={Link} to="/">
          AetherTech
        </Typography>
        <div className="nav-links">
          <Tooltip title="Home">
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              aria-label="Home"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Products">
            <IconButton
              color="inherit"
              component={Link}
              to="/products"
              aria-label="Products"
            >
              <StorefrontIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Checkout">
            <IconButton
              color="inherit"
              component={Link}
              to="/checkout"
              aria-label="Checkout"
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </div>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenu}
          aria-label="account"
        >
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose} component={Link} to="/login">
            Login
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
