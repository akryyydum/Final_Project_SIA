const express = require('express');
const { createOrder, getOrders, updateOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id', updateOrder);
router.patch('/:id', updateOrder); // Add PATCH route for updating order status

module.exports = router;