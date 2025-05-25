const Cart = require('../models/Cart');

exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ error: 'Each item must have productId and quantity' });
      }
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ error: `Invalid productId: ${item.productId}` });
      }
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.items = items;
      cart.updatedAt = Date.now();
      await cart.save();
      return res.json(cart);
    } else {
      cart = new Cart({ userId: req.userId, items });
      await cart.save();
      return res.status(201).json(cart);
    }
  } catch (err) {
    console.error('Error in updateCart:', err);
    res.status(400).json({ error: err.message });
  }
};

