import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Divider,
  Space,
  Image,
  Modal,
} from 'antd';  // <-- import Modal here
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import './Cart.css';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  // Track selected items by their id
  const [selectedIds, setSelectedIds] = useState(cartItems.map(item => item.productId || item._id));

  // Update selectedIds if cartItems change (e.g., after removing an item)
  React.useEffect(() => {
    setSelectedIds(ids => ids.filter(id => cartItems.some(item => (item.productId || item._id) === id)));
  }, [cartItems]);

  const handleSelect = (id, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(selId => selId !== id)
    );
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.productId || item._id));
  const total = selectedItems.reduce(
    (sum, item) =>
      sum +
      (typeof item.price === 'number' ? item.price : 0) *
        (item.quantity || 1),
    0
  );

  const showConfirmRemove = (id) => {
    confirm({
      title: 'Are you sure you want to remove this item from your cart?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        removeFromCart(id);
      },
      onCancel() {
      },
    });
  };

  return (
    <div className="cart-container">
      <br />
      <Title level={2} className="cart-title">Shopping Bag</Title>

      {cartItems.length === 0 ? (
        <Text className="empty-cart-text">Your cart is empty.</Text>
      ) : (
        <>
          <Row gutter={[24, 24]} justify="center">
            {cartItems.map((item, index) => {
              const id = item.productId || item._id || index;
              return (
                <Col xs={24} md={20} key={id}>
                  <Card className="cart-item" bordered={false}>
                    <div className="cart-item-box">
                      {/* Checkbox for selection */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={e => handleSelect(id, e.target.checked)}
                        style={{ marginRight: 16, marginTop: 32 }}
                        aria-label={`Select ${item.name} for checkout`}
                      />
                      <div className="cart-item-image-container">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          className="cart-item-image"
                          preview={false}
                        />
                      </div>
                      <div className="cart-item-details">
                        <Title level={5}>{item.name}</Title>
                        <Text strong>₱{Number(item.price).toLocaleString()}</Text>
                        <p className="cart-item-description">{item.description}</p>
                        <div className="cart-qty-actions">
                          <Space className="qty-buttons">
                            <Button
                              icon={<MinusOutlined />}
                              size="small"
                              shape="circle"
                              onClick={() =>
                                decreaseQty(item.productId || item._id)
                              }
                              disabled={item.quantity <= 1}
                            />
                            <Text>{item.quantity}</Text>
                            <Button
                              icon={<PlusOutlined />}
                              size="small"
                              shape="circle"
                              onClick={() =>
                                increaseQty(item.productId || item._id)
                              }
                            />
                          </Space>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this item from your cart?')) {
                                removeFromCart(item.productId || item._id);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Divider className="cart-divider" />

          <div className="cart-total-container">
            <Title level={4}>Total: ₱{total.toLocaleString()}</Title>
            <Button
              type="primary"
              className="checkout-button"
              size="large"
              disabled={selectedItems.length === 0}
              onClick={() => navigate('/checkout', { state: { selectedItems } })}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
