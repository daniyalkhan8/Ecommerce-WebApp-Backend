const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct } = require('../controllers/sellerProductsController');
const { verifySellerJWT } = require('../middleware/authMiddleware');

router.post('/add-product', verifySellerJWT, addProduct);
router.get('/get-products', verifySellerJWT, getProducts);
router.put('/update-product/:id', verifySellerJWT, updateProduct);

module.exports = router;