const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../middleware/authMiddleware');
const { getAllProducts } = require('../../controllers/users/usersProductsController');

router.get('/getproducts', verifyUserJWT, getAllProducts);

module.exports = router;