const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../middleware/authMiddleware');
const { addToWishList, removeFromWishList, getWishList } = require('../../controllers/users/usersWishListController');

router.post('/addtowishlist/:id', verifyUserJWT, addToWishList);
router.get('/getwishlist', verifyUserJWT, getWishList);
router.delete('/removefromwishlist/:id', verifyUserJWT, removeFromWishList);

module.exports = router;