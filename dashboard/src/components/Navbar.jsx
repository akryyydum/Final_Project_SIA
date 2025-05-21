// // src/components/Navbar.js
// import React from 'react';
// import './Navbar.css';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Tooltip,
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import HomeIcon from '@mui/icons-material/Home';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// const Navbar = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar position="fixed" className="navbar">
//       <Toolbar className="toolbar">
//         <Typography variant="h6" className="logo" component={Link} to="/">
//           AetherTech
//         </Typography>
//         <div className="nav-links">
//           <Tooltip title="Home">
//             <IconButton
//               color="inherit"
//               component={Link}
//               to="/"
//               aria-label="Home"
//             >
//               <HomeIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Products">
//             <IconButton
//               color="inherit"
//               component={Link}
//               to="/products"
//               aria-label="Products"
//             >
//               <StorefrontIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Checkout">
//             <IconButton
//               color="inherit"
//               component={Link}
//               to="/checkout"
//               aria-label="Checkout"
//             >
//               <ShoppingCartIcon />
//             </IconButton>
//           </Tooltip>
//         </div>
//         <IconButton
//           edge="end"
//           color="inherit"
//           onClick={handleMenu}
//           aria-label="account"
//         >
//           <AccountCircle />
//         </IconButton>
//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//           <MenuItem onClick={handleClose} component={Link} to="/login">
//             Login
//           </MenuItem>
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;



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
import GroupIcon from '@mui/icons-material/Group'; // Users icon
import AddBoxIcon from '@mui/icons-material/AddBox'; // Add Product icon
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Get role from localStorage (set after login)
  let role = null;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // JWT payload is in the middle part, base64 encoded
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    }
  } catch (e) {
    role = null;
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
        <Typography variant="h6" className="logo" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          AetherTech
        </Typography>
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
              <Tooltip title="Users">
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
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenu}
          aria-label="account"
        >
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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