// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAdmin = require('../middleware/requireAdmin');
const userController = require('../controllers/userController');

// GET /api/users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user
router.put('/:id', requireAdmin, userController.updateUser);

// Delete user
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
