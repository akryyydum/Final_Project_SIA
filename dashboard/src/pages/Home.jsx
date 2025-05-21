
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/productAPI';
import { Link } from 'react-router-dom';
import '../pages/Home.css';
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
import HeroPhoneImage from '../assets/iphone.png'; 

const Home = () => {
  console.log('Home component is being rendered');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container sx={{ py: 8 }}>
      <div className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">
            SMART GADGETS <br />
            FOR YOUR MODERN LIFE
          </h1>
          <p className="hero-subtitle">
            Discover the latest smartphones, tablets, and smart appliances that blend style with performance. Powered by cutting-edge technology and sleek designs.
          </p>
          <div className="hero-buttons">
            <Button variant="contained" className="order-now-btn">Shop Now</Button>
            <Button variant="text" className="learn-more-btn">Learn More</Button>
          </div>
          <div className="brand-collab">
            <p>In partnership with</p>
            <div className="brands">
              <img src="../assets/apple.png" alt="Apple" />
              <img src="../assets/samsung.png" alt="Samsung" />
              <img src="../assets/lg.png" alt="LG" />
              <img src="../assets/sony.png" alt="Sony" />
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={HeroPhoneImage} alt="Smartphone" />
        </div>
      </div>



      <Grid container spacing={4}>
        {products.map(product => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="product-card">
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                className="product-image"
              />
              <CardContent>
                <Typography variant="h6" className="product-title">{product.name}</Typography>
                <Typography className="product-price">${product.price.toFixed(2)}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  className="view-details-button"
                  component={Link}
                  to={`/product/${product._id}`}
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
