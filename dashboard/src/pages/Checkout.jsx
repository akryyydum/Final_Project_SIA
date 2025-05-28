import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, Alert, Card, List, Divider, Select, Badge, Spin } from 'antd';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
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
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { decreaseStockByOrder } = useProductContext();
  const location = useLocation();

  // Use selectedItems from navigation state if present, otherwise all cartItems
  const selectedItems = location.state?.selectedItems && location.state.selectedItems.length > 0
    ? location.state.selectedItems
    : cartItems;

  const total = selectedItems.reduce(
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

      // Use selectedItems instead of cartItems
      const items = selectedItems.map(item => {
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

      // Update frontend product stock immediately after order
      await decreaseStockByOrder(items);

      // Clear cart in backend after successful order
      if (user?.token) {
        try {
          await axios.delete("http://localhost:5003/api/carts/me", {
            headers: { Authorization: `Bearer ${user.token}` }
          });
        } catch (err) {
          console.warn("Failed to clear cart in backend:", err?.response?.data || err.message);
        }
      }

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

  useEffect(() => {
    // Fetch customer's orders if logged in
    const fetchCustomerOrders = async () => {
      if (!user?.userId) return;
      setOrdersLoading(true);
      try {
        const res = await axios.get("http://localhost:5002/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Filter only orders for this user
        const myOrders = res.data.filter(order => order.userId === user.userId);
        setCustomerOrders(myOrders);
      } catch (err) {
        setCustomerOrders([]);
      }
      setOrdersLoading(false);
    };
    fetchCustomerOrders();
    // eslint-disable-next-line
  }, [user, success]); // refetch on new order

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
              dataSource={selectedItems}
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

          <Divider />
          <Title level={4} style={{ marginTop: 32 }}>Your Orders</Title>
          {ordersLoading ? (
            <Spin />
          ) : customerOrders.length === 0 ? (
            <Alert type="info" message="You have not placed any orders yet." />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={customerOrders}
              renderItem={order => (
                <Card key={order._id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <Typography.Text strong>Order ID:</Typography.Text> {order._id}
                    </div>
                    <Badge
                      status={
                        order.status === "approved"
                          ? "success"
                          : order.status === "cancelled"
                          ? "error"
                          : "processing"
                      }
                      text={order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
                    />
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div>
                    <Typography.Text>Placed: {new Date(order.createdAt).toLocaleString()}</Typography.Text>
                  </div>
                  <List
                    size="small"
                    dataSource={order.items}
                    renderItem={item => (
                      <List.Item>
                        {item.productName} x{item.quantity} — ${item.productPrice?.toFixed(2)}
                      </List.Item>
                    )}
                  />
                  <Divider style={{ margin: "8px 0" }} />
                  <Typography.Text strong>Total: ${order.total?.toFixed(2)}</Typography.Text>
                </Card>
              )}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
