import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Link as MuiLink,
  TextField,
  Paper,
} from '@mui/material';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import LoginImage from '../assets/login-at.jpg';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password } = form;

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });
      if (res.data && res.data.token) {
        login(res.data.token);  // save token in context + localStorage
        setLoading(false);
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-section">
        <img src={LoginImage} alt="Login Visual" className="login-image" />
      </div>

      <div className="login-form-section">
        <Paper elevation={3} className="login-card">
          <Typography variant="h4" className="login-title" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              className="login-alert"
            >
              {error}
            </Alert>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              autoComplete="email"
              size="large"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              autoComplete="current-password"
              size="large"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              className="login-button"
              style={{ marginTop: 16 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" align="center" style={{ marginTop: 16 }}>
            Don't have an account?{' '}
            <MuiLink component={RouterLink} to="/signup" underline="hover">
              Sign Up
            </MuiLink>
          </Typography>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
