import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Card,
  Collapse,
  Badge,
  Divider,
  Empty,
  message,
} from "antd";
import { useAuth } from "../context/AuthContext";
import "./CheckoutList.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const CheckoutList = () => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Optional: Sort by newest first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (error) {
        message.error("Failed to fetch orders.");
      }
    };

    if (user?.role === "admin") fetchOrders();
  }, [token, user]);

  if (user?.role !== "admin") {
    return <Text type="danger">You are not authorized to view this page.</Text>;
  }

  return (
    <Layout className="checkout-container">
      <Content>
        <Title level={2} className="checkout-title">All Orders</Title>

        {orders.length === 0 ? (
          <Empty description="No orders found." />
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="checkout-card">
              <div className="checkout-card-header">
                <Title level={5}>Order by: {order.customer?.name}</Title>
                <Badge
                  status={order.status === "Delivered" ? "success" : "processing"}
                  text={order.status || "Pending"}
                />
              </div>
              <div className="checkout-details">
                <Text block>Email: {order.customer?.email}</Text>
                <br />
                <Text block>Address: {order.customer?.address}</Text>
              </div>
              <Collapse ghost>
                <Panel header="View Items" key="1">
                  {order.items.map((item, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <Text>
                        {item.productName || "Unknown"} x{item.quantity} — $
                        {item.productPrice?.toFixed(2) || 0} each
                      </Text>
                    </div>
                  ))}
                </Panel>
              </Collapse>
              <Divider />
              <Text className="checkout-total">Total: ${order.total?.toFixed(2)}</Text>
              <br />
              <Text className="checkout-timestamp">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </Text>
            </Card>
          ))
        )}
      </Content>
    </Layout>
  );
};

export default CheckoutList;
