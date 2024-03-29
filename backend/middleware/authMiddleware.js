const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/Users');
const Seller = require('../models/Sellers');

// Middleware to protect the User routes by verifying JWT
const verifyUserJWT = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1];
        const userId = jwt.verify(token, process.env.JWT_SECERET);

        // Checking if the user with same id exist
        const verifyUser = await User.findById(userId.user).select('_id');
        if (!verifyUser) {
            res.status(401);
            throw new Error('Unauthorized Access');
        } else {
            req.user = verifyUser;
            next();
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token found.');
    }
});

// Middleware to protect the Seller routes by verifying JWT
const verifySellerJWT = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1];
        const sellerId = jwt.verify(token, process.env.JWT_SECERET);

        // Checking if the seller with same id exist
        const verifySeller = await Seller.findById(sellerId.seller).select('_id');
        if (!verifySeller) {
            res.status(401);
            throw new Error('Unauthorized Access');
        } else {
            req.seller = verifySeller;
            next();
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token found.');
    }
});

module.exports = { verifyUserJWT, verifySellerJWT }