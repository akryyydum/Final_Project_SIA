const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCartByUser,
  updateCart,
} = require('../controllers/cartController');

const router = express.Router();

router.use(authMiddleware); // protect all routes below

router.get('/me', getCartByUser);
router.put('/me', updateCart);

module.exports = router;
