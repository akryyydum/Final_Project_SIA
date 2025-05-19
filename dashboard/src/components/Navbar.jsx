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
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar className="toolbar">
        <Typography variant="h5" className="logo" component={Link} to="/">
           AetherTech
        </Typography>
        <div className="nav-links">
          <Tooltip title="Home">
            <IconButton
              color="inherit"
              component={Link}
              to="/"
              aria-label="Home"
              size="large"
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
              size="large"
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
              size="large"
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </div>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleMenu}
          aria-label="account menu"
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
