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
  Button,
  Spin,
  Segmented,
} from "antd";
import { useAuth } from "../context/AuthContext";
import "./CheckoutList.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const CheckoutList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // for button actions
  const [filter, setFilter] = useState("all");
  const { token, user } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      message.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
    // eslint-disable-next-line
  }, [token, user]);

  const handleUpdateOrder = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:5002/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Order ${newStatus === "approved" ? "approved" : "cancelled"}!`);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order.");
    }
    setLoading(false);
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "approved") return order.status === "approved";
    if (filter === "cancelled") return order.status === "cancelled";
    if (filter === "pending") return order.status === "pending";
    return true;
  });

  if (user?.role !== "admin") {
    return <Text type="danger">You are not authorized to view this page.</Text>;
  }

  return (
    <Layout className="checkout-container">
      <Content>
        <Title level={2} className="checkout-title">All Orders</Title>

        {/* Sort/Filter Buttons */}
        <Segmented
          options={[
            { label: "All", value: "all" },
            { label: "Approved", value: "approved" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Pending", value: "pending" },
          ]}
          value={filter}
          onChange={setFilter}
          style={{ marginBottom: 24 }}
        />

        {filteredOrders.length === 0 ? (
          <Empty description="No orders found." />
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id} className="checkout-card">
              <div className="checkout-card-header">
                <Title level={5}>Order by: {order.customer?.name}</Title>
                <Badge
                  status={order.status === "Delivered" ? "success" : order.status === "approved" ? "success" : order.status === "cancelled" ? "error" : "processing"}
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
              {/* Approve/Cancel buttons for pending orders */}
              {order.status === "pending" && (
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    loading={loading}
                    onClick={() => handleUpdateOrder(order._id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    loading={loading}
                    onClick={() => handleUpdateOrder(order._id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </Content>
    </Layout>
  );
};

export default CheckoutList;
