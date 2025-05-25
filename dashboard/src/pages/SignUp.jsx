import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Alert, Link as MuiLink, MenuItem
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser } from '../api/userApi';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">Sign Up</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          name="name"
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Role"
          name="role"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        <Typography variant="body2" align="center">
          Already have an account? <MuiLink component={RouterLink} to="/login">Login</MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
