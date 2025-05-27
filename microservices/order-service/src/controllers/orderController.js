const Order = require('../models/Order');
const Product = require('../models/Product');
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, status, customer } = req.body;

    // Fetch product names for each item
const axios = require('axios');

const itemsWithNames = await Promise.all(
  items.map(async (item) => {
    let productName = "Unknown";
    let productPrice = 0;
    try {
      // Replace with your product-service URL and port
      const res = await axios.get(`http://localhost:5001/api/products/${item.productId}`);
      productName = res.data.name;
      productPrice = res.data.price;
    } catch (err) {
      // fallback if product-service is down or product not found
    }
    return {
      productId: item.productId,
      productName,
      productPrice,
      quantity: item.quantity,
    };
  })
);

    const order = new Order({
      userId,
      items: itemsWithNames,
      total,
      status,
      customer,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
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