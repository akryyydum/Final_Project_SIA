import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/productAPI';
import { Link } from 'react-router-dom';

import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Container,
} from '@mui/material';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Apple Store Products
      </Typography>

      <Grid container spacing={4}>
        {products.map(product => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={product.imageUrl}
                alt={product.name}
                sx={{ height: 200, objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography>${product.price.toFixed(2)}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/product/${product._id}`}
                  variant="contained"
                  color="primary"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
