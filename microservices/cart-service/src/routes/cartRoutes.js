const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCart, updateCart } = require('../controllers/cartController');

router.use(authMiddleware); // Protect all cart routes

router.get('/me', getCart);
router.put('/me', updateCart);

module.exports = router;
