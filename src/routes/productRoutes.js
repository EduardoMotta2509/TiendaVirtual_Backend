const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.post('/', verifyAdmin, createProduct);

module.exports = router;