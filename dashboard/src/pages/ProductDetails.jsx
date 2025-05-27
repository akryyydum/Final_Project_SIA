import React from 'react';
import { Typography, Tag, Row, Col, Button, Divider } from 'antd';
import './ProductDetails.css';

const { Title, Paragraph, Text } = Typography;

const ProductDetails = ({
  _id,
  name,
  description,
  price,
  imageUrl,
  categories = [],
  stock,
  onAddToBag,
  onClose, // <-- New prop
}) => {
  const formattedPrice = price
    ? price.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      })
    : "Price not available";

  const handleAddToBag = () => {
    if (onAddToBag) onAddToBag(_id);
    if (onClose) onClose(); // <-- Close modal after adding to cart
  };

  return (
    <div className="product-details-container" role="region" aria-label={`Details of product: ${name}`}>
      <Row gutter={[48, 24]} justify="center" align="middle">
        <Col xs={24} md={10}>
          <div className="product-image-wrapper">
            <img
              src={imageUrl || "/assets/default.png"}
              alt={name || "Product image"}
              className="product-image"
              loading="lazy"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Title level={2} className="product-title">{name}</Title>
          <Text 
            className="product-price" 
            aria-label={`Price: ${formattedPrice}`} 
            aria-live="polite"
            aria-atomic="true"
          >
            {formattedPrice}
          </Text>
          <Divider />
          <Paragraph className="product-description">{description}</Paragraph>

          {categories.length > 0 && (
            <div className="product-tags" aria-label="Product categories">
              {categories.map((cat) => (
                <Tag key={cat} color="blue">
                  {cat}
                </Tag>
              ))}
            </div>
          )}

          <Button
            type="primary"
            size="large"
            className="apple-buy-button"
            disabled={stock === 0}
            onClick={handleAddToBag}
            aria-label={stock === 0 ? "Out of stock" : `Add ${name} to bag`}
          >
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetails;
