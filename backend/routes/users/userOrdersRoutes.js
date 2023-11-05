const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../middleware/authMiddleware');


module.exports = router