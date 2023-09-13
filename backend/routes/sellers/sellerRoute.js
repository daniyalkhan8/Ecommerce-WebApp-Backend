const express = require('express');
const router = express.Router();
const { sellerLogin, sellerRegister, sellerResetPass } = require('../../controllers/sellers/sellerController');
const { verifySellerJWT } = require('../../middleware/authMiddleware');

router.post('/login', sellerLogin);
router.post('/register', sellerRegister);
router.put('/resetpassword', verifySellerJWT, sellerResetPass);

module.exports = router;