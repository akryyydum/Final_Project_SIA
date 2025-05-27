import React, { useState } from 'react';
import axios from 'axios';
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
import { useCart } from '../context/CartContext'; // <-- Import this
import { useAuth } from '../context/AuthContext'; // Add this import

const Checkout = () => {
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { cartItems, clearCart } = useCart(); // <-- add clearCart
  const { user } = useAuth(); // Get the logged-in user

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const handleChange = (e) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, address } = orderInfo;

    if (!name || !email || !address) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      // Map cartItems to the required format
      const items = cartItems.map(item => ({
        productId: item._id, // Always use _id if that's what your cart uses
        quantity: item.quantity || 1
      }));

      console.log({
        userId: user?.userId,
        items,
        total,
        createdAt: new Date(),
        customer: { name, email, address }
      });

      await axios.post("http://localhost:5002/api/orders", {
        userId: user?.userId, // must match your AuthContext user object
        items,
        total,
        createdAt: new Date(),
        customer: { name, email, address } // <-- add this line
      });
      setError('');
      setSuccess('Order placed successfully!');
      clearCart(); // <-- clear the cart here
    } catch  {
      setError('Failed to place order');
      setSuccess('');
    }
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
                    <ListItem key={item.productId || item._id || index} divider>
                      <ListItemText
                        primary={`${item.name || "Unknown"} x${item.quantity}`}
                        secondary={`$${(item.price ?? 0).toFixed(2)} each`}
                      />
                      <Typography variant="body2">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
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
