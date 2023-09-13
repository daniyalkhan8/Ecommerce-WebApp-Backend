const express = require('express');
const router = express.Router();
const { userLogin, userRegister, resetPassword } = require('../../controllers/users/usersController');
const { verifyUserJWT } = require('../../middleware/authMiddleware');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.put('/resetpassword', verifyUserJWT, resetPassword);

module.exports = router;