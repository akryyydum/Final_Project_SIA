const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, status, customer } = req.body;

    const itemsWithNames = await Promise.all(
      items.map(async (item) => {
        let productName = "Unknown";
        let productPrice = 0;
        try {
          const resProduct = await axios.get(`http://localhost:5001/api/products/${item.productId}`);
          productName = resProduct.data.name;
          productPrice = resProduct.data.price;
        } catch (err) {
          console.error('Order item fetch error:', err.message); // Just log, don't send response here!
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
    console.error('Order creation error:', err); // Only send response here
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