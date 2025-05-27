import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, Alert, Card, List, Divider, Select } from 'antd';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const { Title } = Typography;
const { Option } = Select;

const countriesData = {
  Philippines: {
    states: {
      'Nueva Vizcaya': ['Bayombong', 'Bagabag', 'Solano'],
      'Metro Manila': ['Quezon City', 'Manila', 'Makati'],
    },
  },
  USA: {
    states: {
      California: ['Los Angeles', 'San Francisco', 'San Diego'],
      Texas: ['Houston', 'Austin', 'Dallas'],
    },
  },
  Canada: {
    states: {
      Ontario: ['Toronto', 'Ottawa', 'Hamilton'],
      Quebec: ['Montreal', 'Quebec City', 'Laval'],
    },
  },
};

const Checkout = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const states = selectedCountry ? Object.keys(countriesData[selectedCountry].states) : [];

  const cities =
    selectedCountry && selectedState
      ? countriesData[selectedCountry].states[selectedState]
      : [];

  const onCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState(null);
    form.setFieldsValue({ state: undefined, city: undefined });
  };

  const onStateChange = (value) => {
    setSelectedState(value);
    form.setFieldsValue({ city: undefined });
  };

  const onFinish = async (values) => {
    const { name, email, street, city, state, zip, country } = values;
    const fullAddress = `${street}, ${city}, ${state} ${zip}, ${country}`;

    try {
      console.log("cartItems:", cartItems);

      const items = cartItems.map(item => {
        const productId = item.productId ?? item._id ?? null;

        if (!productId) {
          console.warn('Missing productId and _id for cart item:', item);
        }

        return {
          productId,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity || 1
        };
      });

      console.log("Order items to send:", items);

      if (items.some(item => !item.productId)) {
        setError('One or more cart items are missing a product ID. Please refresh your cart.');
        return;
      }

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
      setSelectedCountry(null);
      setSelectedState(null);
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
  rules={[
    { required: true, message: 'Please enter your full name' },
    {
      pattern: /^[A-Za-z.\s]+$/,
      message: 'Name can only contain letters, spaces, and dots',
    },
  ]}
>
  <Input
    size="large"
    placeholder="Juan C. Dela Cruz Jr."
    onKeyPress={(e) => {
      if (!/[A-Za-z.\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
  />
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
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Select a country' }]}
            >
              <Select
                size="large"
                placeholder="Select country"
                onChange={onCountryChange}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {Object.keys(countriesData).map((country) => (
                  <Option key={country} value={country}>{country}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="state"
              label="State / Province"
              rules={[{ required: true, message: 'Select a state' }]}
            >
              <Select
                size="large"
                placeholder={selectedCountry ? "Select state" : "Select country first"}
                onChange={onStateChange}
                allowClear
                disabled={!selectedCountry}
                showSearch
                optionFilterProp="children"
              >
                {states.map((state) => (
                  <Option key={state} value={state}>{state}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Select a city' }]}
            >
              <Select
                size="large"
                placeholder={selectedState ? "Select city" : "Select state first"}
                allowClear
                disabled={!selectedState}
                showSearch
                optionFilterProp="children"
              >
                {cities.map((city) => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
  name="zip"
  label="ZIP Code"
  rules={[
    { required: true, message: 'Enter ZIP code' },
    {
      pattern: /^\d+$/,
      message: 'ZIP code must contain only numbers',
    },
  ]}
>
  <Input
    size="large"
    placeholder="3700"
    maxLength={10}
    onKeyPress={(e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>

              </Col>
            </Row>

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
