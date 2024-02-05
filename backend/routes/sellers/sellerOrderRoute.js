const express = require('express');
const router = express.Router();
const { verifySellerJWT } = require('../../middleware/authMiddleware');
const { 
    updateOrderState, 
    getOrders
} = require('../../controllers/sellers/sellerOrdersController');

router.get('/getorders', verifySellerJWT, getOrders);
router.put('/updateorderstate/:id', verifySellerJWT, updateOrderState);

module.exports = router;