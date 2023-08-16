const express = require('express');
const router = express.Router();
const { addProduct } = require('../controllers/productsController');
const { verifySellerJWT } = require('../middleware/authMiddleware');

router.post('/add-product', verifySellerJWT, addProduct);

module.exports = router;