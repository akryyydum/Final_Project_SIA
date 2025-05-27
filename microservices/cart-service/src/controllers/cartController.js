const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    res.json(cart || { userId: req.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    console.log("Received items:", items);

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items });
    } else {
      cart.items = items;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Cart save error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
