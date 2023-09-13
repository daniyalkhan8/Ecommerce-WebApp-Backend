const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../../controllers/sellers/sellerProductsController');
const { verifySellerJWT } = require('../../middleware/authMiddleware');

router.post('/add-product', verifySellerJWT, addProduct);
router.get('/get-products', verifySellerJWT, getProducts);
router.put('/update-product/:id', verifySellerJWT, updateProduct);
router.delete('/delete-product/:id', verifySellerJWT, deleteProduct);

module.exports = router;