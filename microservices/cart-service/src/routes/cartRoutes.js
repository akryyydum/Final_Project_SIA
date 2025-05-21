const express = require('express');
const {
  createCart,
  getCarts,
  updateCart,
  getCartByUser
} = require('../controllers/cartController');

const router = express.Router();

router.post('/', createCart);
router.get('/', getCarts);
router.get('/:userId', getCartByUser);
router.put('/:userId', updateCart);

module.exports = router;