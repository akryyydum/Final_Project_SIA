const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');
const mongoose = require('mongoose');
const { connect } = require('../../rabbitmq/connection'); // fixed path

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, status = 'pending', customer } = req.body;

    const normalizedItems = items.map(item => {
      let pid = item.productId;
      if (typeof pid === 'string' && mongoose.Types.ObjectId.isValid(pid)) {
        pid = new mongoose.Types.ObjectId(pid);
      } else if (pid && pid._bsontype === 'ObjectID') {
        // already valid
      } else {
        pid = null;
      }

      return {
        ...item,
        productId: pid
      };
    });

    // Check for invalid or null productId
    const invalid = normalizedItems.find(item => !item.productId);
    if (invalid) {
      return res.status(400).json({ error: "One or more order items are missing a valid productId." });
    }

    const itemsWithNames = await Promise.all(
      normalizedItems.map(async (item) => {
        let productName = item.productName || "Unknown";
        let productPrice = item.productPrice || 0;

        // Only fetch from product service if not provided by frontend
        if (!item.productName || !item.productPrice) {
          try {
            const resProduct = await axios.get(`http://localhost:4000/api/products/${item.productId}`);
            if (resProduct.status === 200 && resProduct.data?.name) {
              productName = resProduct.data.name;
              productPrice = resProduct.data.price;
            }
          } catch (err) {
            console.error(`Failed to fetch product: ${item.productId}`, err.message);
          }
        }

        return {
          productId: item.productId,
          productName,
          productPrice,
          quantity: item.quantity
        };
      })
    );

    const order = new Order({
      userId,
      items: itemsWithNames,
      total,
      status,
      customer,
      createdAt: new Date()
    });

    await order.save();

    // Send order notification to RabbitMQ (admins receive, customers send)
    try {
      const channel = await connect();
      const queue = 'order_notifications';
      await channel.assertQueue(queue, { durable: false });
      // Message includes order and a role field for clarity
      channel.sendToQueue(queue, Buffer.from(JSON.stringify({
        type: 'NEW_ORDER',
        order,
        from: 'customer',
        to: 'admin'
      })));
      console.log('Order notification sent to RabbitMQ queue:', queue); // <-- add this line
    } catch (err) {
      console.error('Failed to send order notification to RabbitMQ:', err.message);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId'); // <-- this populates product details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOTE: Make sure your MongoDB connection string uses process.env.MONGO_URI
// Use 'localhost' when running locally, and 'mongo-order' when running in Docker.

// Ensure you are not hardcoding mongo-order or order-rabbitmq here.