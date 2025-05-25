
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/productAPI';
import '../pages/Home.css';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
} from '@mui/material';
import HeroPhoneImage from '../assets/iphone.png'; 
import appleLogo from '../assets/apple.png';
import samsungLogo from '../assets/samsung.png';
import lgLogo from '../assets/lg.png';
import sonyLogo from '../assets/sony.png';
const Home = () => {
  console.log('Home component is being rendered');
  const [setProducts] = useState([]);
  const navigate = useNavigate();
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
            <Button variant="contained" onClick={() => navigate('/products')} className="order-now-btn">Shop Now</Button>
          </div>
          <div className="brand-collab">
            <p>In partnership with</p>
            <div className="brands">
              <img src={appleLogo} alt="Apple" />
              <img src={samsungLogo} alt="Samsung" />
              <img src={lgLogo} alt="LG" />
              <img src={sonyLogo} alt="Sony" />
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={HeroPhoneImage} alt="Smartphone" />
        </div>
      </div>
    </Container>
  );
};

export default Home;
