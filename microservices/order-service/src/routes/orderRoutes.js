const express = require('express');
const { createOrder, getOrders, updateOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id', updateOrder);

module.exports = router;