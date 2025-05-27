import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Alert, Card, List, Divider } from 'antd';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const { Title } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const onFinish = async (values) => {
    const { name, email, street, city, state, zip, country } = values;
    const fullAddress = `${street}, ${city}, ${state} ${zip}, ${country}`;

    try {
      const items = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity || 1
      }));

      await axios.post('http://localhost:5002/api/orders', {
        userId: user?.userId,
        items,
        total,
        createdAt: new Date(),
        customer: {
          name,
          email,
          address: fullAddress
        }
      });

      setSuccess('Order placed successfully!');
      setError('');
      clearCart();
      form.resetFields();
    } catch (err) {
      console.error(err);
      setError('Failed to place order');
      setSuccess('');
    }
  };

  return (
    <div className="checkout-container">
      <br />
      <Title level={2} className="checkout-title">Checkout</Title>

      <Row gutter={32}>
        {/* Billing Form */}
        <Col xs={24} md={12}>
          <Title level={4}>Billing Information</Title>

          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
          {success && <Alert type="success" message={success} showIcon style={{ marginBottom: 16 }} />}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input size="large" placeholder="Felix C. Leid Jr." />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input size="large" placeholder="cardoxlolaflora@apple.com" />
            </Form.Item>

            <Form.Item
              name="street"
              label="Street Address"
              rules={[{ required: true, message: 'Enter street address' }]}
            >
              <Input size="large" placeholder="1 Apple Park Way" />
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Enter city' }]}
            >
              <Input size="large" placeholder="Bayombong" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Enter state' }]}
                >
                  <Input size="large" placeholder="Nueva Vizcaya" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="zip"
                  label="ZIP Code"
                  rules={[{ required: true, message: 'Enter ZIP code' }]}
                >
                  <Input size="large" placeholder="3700" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Enter country' }]}
            >
              <Input size="large" placeholder="Philippines" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Place Order
              </Button>
            </Form.Item>
          </Form>
        </Col>

        {/* Order Summary */}
        <Col xs={24} md={12}>
          <Title level={4}>Order Summary</Title>
          <Card className="summary-card">
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.name} x${item.quantity}`}
                    description={`$${item.price?.toFixed(2)} each`}
                  />
                  <div>${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <Divider />
            <div className="total-line">
              <span>Total:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
