const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;