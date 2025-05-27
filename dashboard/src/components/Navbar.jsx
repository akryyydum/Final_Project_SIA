import React from 'react';
import './Navbar.css';
import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  PlusSquareOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const { Header } = Layout;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  let role = null, name = null;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role; name = payload.name;
    }
  } catch  {
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

        {/* Show user name and role */}
        {isAuthenticated && name && role && (
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            {name} ({role})
          </Typography>
        )}

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Show Home for all authenticated users */}
          {isAuthenticated && (
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
          )}

          {/* CUSTOMER NAVIGATION */}
          {isAuthenticated && role === 'customer' && (
            <>
              <Tooltip title="Products">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/products" // Update the link to point to the products page
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
              <Tooltip title="Placed Orders">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/checkout-list"
                  aria-label="Placed Orders"
                >
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <p>Hello</p>
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
          {isAuthenticated && name && role && (
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
