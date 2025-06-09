const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Получение всех продуктов
router.get('/', productController.getProducts);

// Получение одного продукта по ID
router.get('/:id', async (req, res) => {
  try {
    const product = await require('../models/productModel').findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Продукт не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения продукта', error: error.message });
  }
});

// Добавление нового продукта
router.post('/', productController.createProduct);

// Обновление продукта по ID
router.put('/:id', productController.updateProduct);

// Добавление отзыва
router.post('/:id/reviews', productController.addReview);

module.exports = router;
