const asyncHandler = require('express-async-handler');
const WishList = require('../../models/WishList');
const Product = require('../../models/Products');

// POST 
// /api/users/products/addtowishlist
// Async function to add a product to whislist
const addToWishList = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error.
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    const user = req.user.id;
    const product = req.params.id;

    // Checking if the product exist in database.
    const verifyProduct = await Product.findById(product).select('id');

    if (!verifyProduct) {
        res.status(400);
        throw new Error('Product does not exist.');
    }

    // Checking if the user has already entered the product in the wishlist
    const checkInWishList = await WishList.findOne({
        user: user,
        product: product
    });

    if (checkInWishList) {
        res.status(400);
        throw new Error('Product already in wishlist.');
    }

    // Adding the product in the wishlist if the user has not added. 
    const wishListItem = await WishList.create({
        user: user,
        product: product
    });

    if (wishListItem) {
        res.status(200).json({ wishListItem });
    } else {
        res.status(500);
        throw new Error('Internal Server Error.');
    }
});

// GET
// /api/users/products/getwishlist
// Async function to get all of the wishlist items of the user
const getWishList = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error.
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    const user = req.user.id;

    const wishListItems = await WishList.find({ user });
    if (!wishListItems) {
        res.status(201).json({ message: 'No products in wishlist.' });
    } else if (wishListItems) {
        res.status(201).json({ wishListItems });
    } else {
        res.status(500);
        throw new Error('Internal Server Error.');
    }
});

// DELETE 
// /api/users/products/removefromwishlist
// Async function to remove a product from wishlist
const removeFromWishList = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error.
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    const user = req.user.id;
    const wishListItem = req.params.id;

    // Checking if the user has added the product in wishlist
    const verifyInWishList = await WishList.findById(wishListItem).select('id');

    if (!verifyInWishList) {
        res.status(400);
        throw new Error('Porduct not in wishlist');
    }

    const deletingWishlist = await WishList.findByIdAndDelete(wishListItem);

    res.status(201).json({ id: wishListItem })
});

module.exports = { addToWishList, getWishList, removeFromWishList }