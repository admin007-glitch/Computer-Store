const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderItems: [
    {
      name: String,
      qty: Number,
      price: Number,
      _id: String,
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Ожидает обработки' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
