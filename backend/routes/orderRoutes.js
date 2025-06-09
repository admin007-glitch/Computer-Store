const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByEmail
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrdersByEmail); // /api/orders?email=user@example.com

module.exports = router;
