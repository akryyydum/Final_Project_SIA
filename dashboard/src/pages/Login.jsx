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
  
   const { login } = useAuth(); // ✅ Use login() from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    // ...existing code...
try {
  const res = await loginUser({ email, password }); // Axios response
  login(res.data.token); // <-- Save only the token string!
  setLoading(false);
  navigate('/');
} catch (err) {
  setError('Invalid email or password');
  setLoading(false);
}
// ...existing code...
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