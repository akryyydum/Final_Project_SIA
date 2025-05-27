import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import phone from '../assets/iphone15pro.png';
import watch from '../assets/apple-watch-series-9.png';
import macbook from '../assets/macbookairm3.png';
import homepod from '../assets/homepod.png';
import accessories from '../assets/accessories.png';
import ipad from '../assets/ipad.png'
import './Home.css';

const { Title, Paragraph, Text } = Typography;

const featuredItems = [
  {
    title: 'iPhone 15 Pro',
    description: 'Titanium. So strong. So light. So Pro.',
    image: phone,
  },
  {
    title: 'MacBook Air M3',
    description: 'Lean. Mean. M3 Machine.',
    image: macbook,
  },
  {
    title: 'Apple Watch Series 9',
    description: 'Smarter. Brighter. Mightier.',
    image: watch,
  },
  {
    title: 'HomePod',
    description: 'Immersive sound for every room.',
    image: homepod,
  },
  {
    title: 'Accessories',
    description: 'Perfectly crafted for your Apple devices.',
    image: accessories,
  },
  {
    title: 'iPad Pro M4',
    description: 'Unbelievably thin. Incredibly powerful.',
    image: ipad,
  },
];


const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [scrollBackground, setScrollBackground] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
        setFadeState('fade-in');
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 100) {
        setScrollBackground(true);
      } else {
        setScrollBackground(false);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentItem = featuredItems[currentIndex];

  return (
    <div className={`apple-home-wrapper ${scrollBackground ? 'gradient-bg' : ''}`}>
      {/* Hero Section */}
      <section className={`apple-hero ${fadeState}`}>
        <img src={currentItem.image} alt={currentItem.title} className="apple-hero-image" />
        <div className="apple-hero-text">
          <Title className="apple-hero-title">{currentItem.title}</Title>
          <Paragraph className="apple-hero-desc">{currentItem.description}</Paragraph>
          <Button
            type="primary"
            size="large"
            className="apple-hero-btn"
            onClick={() => navigate('/products')}
          >
            Buy
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="apple-featured-section">
        <div className="apple-featured-row">
          {featuredItems.map((item, idx) => (
            <Card
              key={idx}
              hoverable
              className="apple-featured-card"
              cover={
                <img
                  alt={item.title}
                  src={item.image}
                  className="apple-featured-img"
                />
              }
            >
              <Card.Meta
                title={<span className="apple-featured-title">{item.title}</span>}
                description={<span className="apple-featured-desc">{item.description}</span>}
              />
              <Button
                type="primary"
                className="apple-featured-buy-btn"
                onClick={() => navigate('/products')}
                style={{ marginTop: 20, borderRadius: 24, width: '100%' }}
              >
                Buy Now
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* About & Contact */}
      <section className="apple-about-contact">
        <Row gutter={[48, 48]}>
          <Col xs={24} md={12}>
            <Title level={3} className="apple-about-title">About Us</Title>
            <Paragraph className="apple-about-text">
            At <strong>AetherTech</strong>, we are passionate about bringing you the latest and greatest in technology. 
            Our mission is to empower everyday experiences through innovative, user-focused solutions that blend performance, design, and reliability. 
            From cutting-edge devices to intuitive software, we strive to deliver products that not only meet your needs but also inspire the future. 
            With a commitment to quality and a vision for tomorrow, AetherTech is your trusted partner in navigating the digital age.
            </Paragraph>

          </Col>
          <Col xs={24} md={12}>
            <Title level={3} className="apple-about-title">Contact Us</Title>
            <Paragraph className="apple-about-text">
              <strong>Email:</strong> support@aethertech.com<br />
              <strong>Phone:</strong> +1 (555) 123-4567<br />
              <strong>Office Hours:</strong> Monday – Friday, 9AM – 6PM (PST)<br />
              <strong>Address:</strong> Saint Mary's University, Bayombong, Nueva Vizcaya
            </Paragraph>
          </Col>
        </Row>
      </section>

      {/* Footer */}
      <footer className="apple-footer">
        <Text type="secondary">© {new Date().getFullYear()} AetherTech. All rights reserved.</Text>
      </footer>
    </div>
  );
};

export default Home;
