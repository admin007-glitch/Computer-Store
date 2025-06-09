const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  brand: String,
  specs: String,
  price: { type: Number, required: true },
  image: String,
  rating: Number,
  stock: Number,
  description: String,
  reviews: [reviewSchema],  // добавляем отзывы
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
