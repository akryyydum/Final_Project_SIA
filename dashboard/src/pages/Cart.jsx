import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cartItems.map((item, index) => (
              <Grid xs={12} md={6} key={item.productId || item._id || index}>
                <Card>
                  <CardContent>
                    <Box display="flex" gap={2}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                      />
                      <Box flex="1">
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography>${item.price.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Box display="flex" alignItems="center">
                      <IconButton onClick={() => decreaseQty(item.productId || item._id)}>
                        <Remove />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton onClick={() => increaseQty(item.productId || item._id)}>
                        <Add />
                      </IconButton>
                    </Box>
                    <IconButton
                      onClick={() => removeFromCart(item.productId || item._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
