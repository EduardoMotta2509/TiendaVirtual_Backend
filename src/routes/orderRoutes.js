const express = require('express');
const router = express.Router();
const { createOrder, returnOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createOrder);
router.put('/:id/return', verifyToken, returnOrder);

module.exports = router;