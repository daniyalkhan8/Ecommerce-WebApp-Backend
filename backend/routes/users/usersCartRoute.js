const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../middleware/authMiddleware');
const {
    addToCart,
    removeCartItem,
    updateCartItemQuantity,
    getCartItem
} = require('../../controllers/users/usersCartController');

router.post('/addtocart/:id', verifyUserJWT, addToCart);
router.get('/getcartitems', verifyUserJWT, getCartItem);
router.put('/updatecartitemquantity/:id', verifyUserJWT, updateCartItemQuantity);
router.delete('/removecartitem/:id', verifyUserJWT, removeCartItem);

module.exports = router;