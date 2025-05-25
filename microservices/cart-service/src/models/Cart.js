const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  getCartByUser,
  updateCart
} = require('../controllers/cartController');

// Apply auth middleware to all routes
router.use(authenticate);

// Routes
router.get('/me', getCartByUser);

// FIXED: use req.userId instead of req.user.id
router.put('/me', async (req, res) => {
  try {
    const userId = req.userId; // ✅ correctly set in authMiddleware
    const { items } = req.body;

    // Validate cart items
    if (!Array.isArray(items) || items.some(item => !item.productId || typeof item.quantity !== 'number')) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    const updatedCart = await require('../models/Cart').findOneAndUpdate(
      { userId },
      { items, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
