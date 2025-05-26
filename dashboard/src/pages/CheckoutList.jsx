import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const CheckoutList = () => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch {
        // Handle error
      }
    };
    if (user?.role === "admin") fetchOrders();
  }, [token, user]);

  if (user?.role !== "admin") {
    return <Typography>You are not authorized to view this page.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>
      {orders.map((order, idx) => (
        <Card key={order._id || idx} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">
              Order by: {order.customer?.name}
            </Typography>
            <Typography>Email: {order.customer?.email}</Typography>
            <Typography>Address: {order.customer?.address}</Typography>
            <List>
              {order.items.map((item, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={`${item.productId?.name || "Unknown"} x${
                      item.quantity
                    }`}
                    secondary={`$${
                      item.productId?.price?.toFixed(2) || 0
                    } each`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1">
              Total: ${order.total?.toFixed(2)}
            </Typography>
            <Typography variant="caption">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default CheckoutList;
