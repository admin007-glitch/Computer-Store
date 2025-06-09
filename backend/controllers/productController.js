const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image, specs } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Название, цена и категория обязательны' });
    }

    const product = new Product({
      name,
      price: Number(price),
      category,
      image,
      specs
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    Object.assign(product, updates);
    const updated = await product.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении товара' });
  }
};

// Новый метод — добавление отзыва
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Комментарий обязателен' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    product.reviews.push({ comment });
    await product.save();

    res.status(201).json({ message: 'Отзыв добавлен' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
