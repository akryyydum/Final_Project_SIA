import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Typography, Button } from 'antd';
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
  } catch { }

  const [menuVisible, setMenuVisible] = useState(false);

  const profileMenu = (
    <Menu onClick={({ key }) => {
      if (key === 'logout') {
        logout();
        navigate('/login');
      }
      setMenuVisible(false);
    }}>
      {isAuthenticated && <Menu.Item disabled>{name} ({role})</Menu.Item>}
      {!isAuthenticated && <Menu.Item key="login" icon={<LoginOutlined />}><Link to="/login">Login</Link></Menu.Item>}
      {isAuthenticated && <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>}
    </Menu>
  );

  return (
    <Header className="apple-header">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img src="/aethertech-icon.png" alt="AetherTech Logo" className="logo-img" />
        <Typography.Title level={3} style={{ margin: 0, fontWeight: 900 }}>AetherTech</Typography.Title>
      </div>



      <Menu mode="horizontal" theme="light" selectable={false} className="nav-menu" style={{ flex: 1 }}>
        {isAuthenticated && <Menu.Item key="home" icon={<HomeOutlined />}><Link to="/">Home</Link></Menu.Item>}
        {isAuthenticated && role === 'customer' && <>
          <Menu.Item key="products" icon={<ShopOutlined />}><Link to="/products">Products</Link></Menu.Item>
          <Menu.Item key="cart" icon={<ShoppingCartOutlined />}><Link to="/cart">Cart</Link></Menu.Item>
        </>}
        {isAuthenticated && role === 'admin' && <>
          <Menu.Item key="users" icon={<TeamOutlined />}><Link to="/users">Users</Link></Menu.Item>
          <Menu.Item key="add-product" icon={<PlusSquareOutlined />}><Link to="/admin/add-product">Add Product</Link></Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}><Link to="/checkout-list">Orders</Link></Menu.Item>
        </>}
      </Menu>

      {isAuthenticated && <Typography.Text type="secondary" className="user-info" ellipsis>{name} ({role})</Typography.Text>}

      <Dropdown overlay={profileMenu} trigger={['click']} onVisibleChange={setMenuVisible} visible={menuVisible}>
        <Button shape="circle" icon={<UserOutlined />} size="large" className="profile-btn" aria-label="User menu" />
      </Dropdown>
    </Header>
  );
};

export default Navbar;
