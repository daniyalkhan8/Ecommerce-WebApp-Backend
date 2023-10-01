const asyncHandler = require('express-async-handler');
const Cart = require('../../models/Cart');
const Product = require('../../models/Products');

// POST 
// /api/users/products/addtocart
// Async function to add a product to cart
const addToCart = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized access');
    }

    const user = req.user.id
    const product = req.params.id
    const { quantity } = req.body;

    // Checking if the quantity of the cart item to be updated is not null, 
    // if null then returning a bad request
    if (!quantity || parseInt(quantity) < 1) {
        res.status(400);
        throw new Error('Please provide the quantity to be updated');
    }

    // Checking if the product exist in database.
    const verifyProduct = await Product.findById(product).select('id price quantity');

    if (!verifyProduct) {
        res.status(400);
        throw new Error('Product does not exist.');
    }

    // Checking if the user has already added the particular product in cart. If it
    // does then updating the cart item else creating a new cart item
    const verifyInCart = await Cart.findOne({
        user: user,
        product: product
    });

    if (verifyInCart) {
        const updatedQuantity = verifyInCart.quantity + parseInt(quantity);
        if (updatedQuantity > verifyProduct.quantity) {
            res.status(400).json({ message: "Not enough stock available." });
        }
        const updatedPrice = verifyInCart.price + (quantity * verifyInCart.prodPrice);
        const cartUpdation = {
            quantity: updatedQuantity,
            price: updatedPrice
        }

        // Updating cart item
        const updatedCart = await Cart.findByIdAndUpdate(
            verifyInCart.id,
            cartUpdation,
            { new: true }
        );

        if (updatedCart) {
            res.status(201).json({ updatedCart });
        } else {
            res.status(500);
            throw new Error('Internal Server Error');
        }
    } else if (!verifyInCart) {
        if (parseInt(quantity) > verifyProduct.quantity) {
            res.status(400).json({ message: "Not enough stock available." });
        }

        // Adding product to cart
        const cartDoc = await Cart.create({
            user: user,
            product: product,
            quantity: parseInt(quantity),
            prodPrice: verifyProduct.price,
            price: parseInt(quantity) * verifyProduct.price
        });

        if (cartDoc) {
            res.status(200).json({ cartDoc });
        } else {
            res.status(500);
            throw new Error('Internal Server Error');
        }
    } else {
        res.status(500);
        throw new Error('Internal Server Error');
    }
});

// GET
// /api/users/products/getcartitems
// Async function to get all of the cart items of the user
const getCartItem = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized access');
    }

    // extracting user id from the user provided by authMiddleware
    const user = req.user.id;

    // Fetching all the cart items of a user
    const cartItems = await Cart.find({ user });

    // Checking for different conditions when fetching all the cart items
    if (!cartItems) {
        res.status(201).json({ message: 'The cart is empty' });
    } else if (cartItems) {
        res.status(201).json({ cartItems });
    } else {
        res.status(500);
        throw new Error('Internal Server Error');
    }
});

// PUT 
// /api/users/products/updatecartitemquantity
// Async function to update a cart item quantity
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized access');
    }

    const cartItem = req.params.id;
    const { quantity } = req.body;

    // Checking if the quantity of the cart item to be updated is not null, 
    // if null then returning a bad request
    if (!quantity || parseInt(quantity) < 1) {
        res.status(400);
        throw new Error('Please provide the quantity to be updated');
    }

    // Checking if the cart item exist
    const verifyCartItem = await Cart.findById(cartItem).select('id product prodPrice');

    if (!verifyCartItem) {
        res.status(400);
        throw new Error('Cart item does not exist');
    }

    // Fetching product quantity to compare it with the quantity user enters in cart
    const productQuantity = await Product.findById(verifyCartItem.product).select('quantity');

    if (productQuantity.quantity < parseInt(quantity)) {
        res.status(400).json({ message: "Not enough stock available." });
    } else {
        // Updating the cart item
        const updatedCartItem = await Cart.findByIdAndUpdate(
            cartItem,
            {
                quantity: parseInt(quantity),
                price: parseInt(quantity) * verifyCartItem.prodPrice
            },
            { new: true }
        );

        if (updatedCartItem) {
            res.status(201).json({ updatedCartItem });
        } else {
            res.status(500);
            throw new Error("Internal Server Error");
        }
    }
});

// DELETE 
// /api/users/products/removecartitem
// Async function to remove a product from cart
const removeCartItem = asyncHandler(async (req, res) => {
    const cartItem = req.params.id;

    // Checking if the user is present and recieved through authMiddleware, 
    // if not then thorwing unauthorized access error
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized access');
    }

    // Checking if the cart item exist
    const verifyCartItem = await Cart.findById(cartItem).select('id');

    if (!verifyCartItem) {
        res.status(400);
        throw new Error('Cart Item does not exist.');
    }

    // Removing the cart item from the database
    const removeCartItem = await Cart.findByIdAndDelete(cartItem);

    // If the Cart item is remove successfully then it will return the cart item id, 
    // else it will throw internal server error
    if (removeCartItem) {
        res.status(200).json({ id: req.params.id });
    } else {
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

module.exports = { addToCart, removeCartItem, updateCartItemQuantity, getCartItem }