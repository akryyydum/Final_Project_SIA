import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

const Checkout = () => {
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock cart data — replace with real data later
  const cartItems = [
    { name: 'iPhone 15 Pro', price: 1299, quantity: 1 },
    { name: 'MacBook Air M2', price: 1099, quantity: 1 },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, address } = orderInfo;

    if (!name || !email || !address) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    // Replace with your order API logic here
    setError('');
    setSuccess('Order placed successfully!');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Billing Form */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Billing Information
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={orderInfo.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={orderInfo.email}
              onChange={handleChange}
              margin="normal"
              required
              type="email"
            />
            <TextField
              fullWidth
              label="Shipping Address"
              name="address"
              value={orderInfo.address}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Place Order
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>

          <Card>
            <CardContent>
              <List>
                {cartItems.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`${item.name} x${item.quantity}`}
                      secondary={`$${item.price.toFixed(2)} each`}
                    />
                    <Typography variant="body2">
                      ${item.price * item.quantity}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
