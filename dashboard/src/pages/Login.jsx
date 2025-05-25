import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link as MuiLink,
} from '@mui/material';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password }); // axios call
      if (res.data && res.data.token) {
        login(res.data.token);  // save token in context + localStorage
        setLoading(false);
        navigate('/'); // redirect on success
      } else {
        throw new Error('No token received');
      }
    } catch  {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>

      <Typography variant="body2" align="center">
        Don't have an account?{' '}
        <MuiLink component={RouterLink} to="/signup" underline="hover">
          Sign Up
        </MuiLink>
      </Typography>
    </Container>
  );
};

export default Login;
