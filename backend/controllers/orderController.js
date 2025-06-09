const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { email, orderItems, totalPrice } = req.body;

    if (
      !email ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      typeof totalPrice !== 'number'
    ) {
      return res.status(400).json({ message: 'Missing or invalid order data' });
    }

    const order = new Order({
      email,
      orderItems,
      totalPrice,
      status: 'Ожидает обработки',
    });

    const created = await order.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании заказа' });
  }
};

const getOrdersByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении заказов' });
  }
};

module.exports = {
  createOrder,
  getOrdersByEmail,
};
