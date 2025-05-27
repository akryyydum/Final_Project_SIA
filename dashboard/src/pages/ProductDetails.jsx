import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/productAPI';
import { Spin, Typography, Tag, Row, Col, Button, Divider } from 'antd';
import './ProductDetails.css';

const { Title, Paragraph, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(id)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-details-container">
      <Row gutter={[48, 24]} justify="center" align="middle">
        <Col xs={24} md={10}>
          <div className="product-image-wrapper">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Title level={2} className="product-title">{product.name}</Title>
          <Text className="product-price">₱{Number(product.price).toLocaleString()}</Text>
          <Divider />
          <Paragraph className="product-description">{product.description}</Paragraph>

          {product.categories && product.categories.length > 0 && (
            <div className="product-tags">
              {product.categories.map((cat) => (
                <Tag key={cat} color="blue">
                  {cat}
                </Tag>
              ))}
            </div>
          )}

          <Button type="primary" size="large" className="apple-buy-button">
            Add to Bag
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetails;
