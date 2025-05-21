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
import { Link, useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Decode name and role from JWT token
  let role = null;
  let name = null;

  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
      name = payload.name;
    }
  } catch (e) {
    role = null;
    name = null;
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar className="toolbar">
        <Typography
          variant="h6"
          className="logo"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
        >
          AetherTech
        </Typography>

        {/* User name and role (optional UI) */}
        {isAuthenticated && (
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            {name} ({role})
          </Typography>
        )}

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

          {/* ADMIN NAVIGATION */}
          {isAuthenticated && role === 'admin' && (
            <>
              <Tooltip title="View Users">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/users"
                  aria-label="Users"
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Product">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/admin/add-product"
                  aria-label="Add Product"
                >
                  <AddBoxIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Checkout List">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/checkout-list"
                  aria-label="Checkout List"
                >
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* CUSTOMER NAVIGATION */}
          {isAuthenticated && role === 'customer' && (
            <>
              <Tooltip title="Products">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/"
                  aria-label="Products"
                >
                  <StorefrontIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  aria-label="Cart"
                >
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>

        {/* Profile Icon and Menu */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenu}
          aria-label="account"
        >
          <AccountCircle />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {isAuthenticated && (
            <MenuItem disabled>
              {name} ({role})
            </MenuItem>
          )}

          {!isAuthenticated && (
            <MenuItem onClick={handleClose} component={Link} to="/login">
              Login
            </MenuItem>
          )}

          {isAuthenticated && (
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
