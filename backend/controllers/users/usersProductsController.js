const asyncHandler = require('express-async-handler');
const Product = require('../../models/Products');

// GET 
// /api/users/products/getproducts
// Async function to get all the products from the product model
const getAllProducts = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized access');
    }

    // Fetching all of the products from the mongoose model
    const getProducts = await Product.find();

    if (!getProducts) {
        res.status({ message: 'No products available' });
    } else {
        res.status(201).json({ getProducts })
    }
});

module.exports = { getAllProducts }