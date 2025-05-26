import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import phone from '../assets/iphone15pro.png';
import watch from '../assets/apple-watch-series-9.png';
import macbook from '../assets/macbookairm3.png';
import './Home.css';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
        setFadeState('fade-in');
      }, 800); // Match CSS fade-out duration
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = featuredItems[currentIndex];

  return (
    <div className="apple-home-wrapper">

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
              At <strong>AetherTech</strong>, we are passionate about bringing you the latest and greatest in technology...
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={3} className="apple-about-title">Contact Us</Title>
            <Paragraph className="apple-about-text">
              <strong>Email:</strong> support@smartgadgets.com<br />
              <strong>Phone:</strong> +1 (555) 123-4567<br />
              <strong>Office Hours:</strong> Monday – Friday, 9AM – 6PM (PST)<br />
              <strong>Address:</strong> 123 Tech Street, Silicon Valley, CA 94043
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
