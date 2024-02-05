const asyncHandler = require('express-async-handler');
const Product = require('../../models/Products');
const Cart = require('../../models/Cart');
const Order = require('../../models/Orders');

// POST 
// /api/users/products/placeorder
// Async function for users to place an order
const placeOrder = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const cartItems = req.body.cartItems;
    const productsArray = [];
    let totalPrice = 0;

    // Checking if the cart items are provided in request body
    if (!cartItems || cartItems.length === 0) {
        res.status(400);
        throw new Error("Can not place an empty order.");
    }

    // Checking if the provided cart items exist in DB
    const verifyCartItems = await Cart.find({ _id: { $in: cartItems } });

    // If the any of the cart items provided in request body does not exist
    // then returning an error message.
    if (!verifyCartItems || verifyCartItems.length !== cartItems.length) {
        res.status(404);
        throw new Error('Cart Item not found.');
    }

    // Looping through the cart items for extracting product info from them.
    for (let i = 0; i < verifyCartItems.length; i++) {
        // The info of every product is stored in prodObject and then stored in productsArray.
        // Incrementing the totalPrice by the verifyCartItems price to get the total price of the order.
        prodObject = {
            product: verifyCartItems[i].product,
            units: verifyCartItems[i].quantity,
            price: verifyCartItems[i].price
        }
        productsArray.push(prodObject);
        totalPrice += verifyCartItems[i].price;
    }

    // Creating a new order
    const newOrder = await Order.create({
        user: user,
        products: productsArray,
        totalPrice: totalPrice,
        status: "new"
    });

    // After the order is created then deleting the cart items used for placing order.
    const delCartItems = await Cart.deleteMany({ _id: { $in: cartItems } });

    // After the order is placed then decrementing the products stock by the quantity selected
    // for order.
    const productUpdOperations = verifyCartItems.map(item => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity } }
        }
    }))

    const productQuantityUpdate = await Product.bulkWrite(productUpdOperations);

    // Returning a json response containing new order if the 
    // order is created + product stock updated + cart items deleted
    if (newOrder && productQuantityUpdate && delCartItems) {
        res.status(200).json({ newOrder });
    } else {
        res.status(500);
        throw new Error('Internal Server Error.')
    }
});


// GET 
// /api/users/products/getorders
// Async function getting all the orders created by the user
const getOrders = asyncHandler(async (req, res) => {
    const user = req.user.id;

    // Fetching all the orders of the particular user.
    const allOrders = await Order.find({ user: user });

    // If the user has placed any order it will be returned in json form.
    if (allOrders) {
        res.status(200).json({ allOrders })
    } else {
        res.status(404);
        throw new Error('No orders placed at the moment.');
    }
});


// PUT 
// /api/users/products/cancelorder/:id
// Async function for a user to cancel any of his particular order.
const cancelOrder = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const order = req.params.id;

    // Finding the particular order of the user.
    const findOrder = await Order.findOne({
        _id: order,
        user: user
    });

    // Checking if the order exist or not
    if (!findOrder) {
        res.status(404);
        throw new Error("The order requested for cancelation can't be found.");
    }
    
    // Checking if the order status is delivered because we can't cancel a delivered order.
    if (findOrder.status === "delivered") {
        res.status(400);
        throw new Error("Orders can not be canceled once delivered.");
    }
    
    // Checking if the order is already canceled or not.
    if (findOrder.status === "canceled") {
        res.status(400);
        throw new Error("The order is already canceled.");
    }

    // Incrementing the stock of every product selected in order by
    // the ordered product quantity before cancelling the order.
    const productQtyUpdate = findOrder.products.map((product) => ({
        updateOne: {
            filter: { _id: product.product },
            update: { $inc: { quantity: +product.units } }
        }
    }));

    const updateProductQty = await Product.bulkWrite(productQtyUpdate);

    // Updating the order state to canceled.
    const updateOrderStatus = await Order.findByIdAndUpdate(
        order,
        { status: 'canceled' },
        { new: true }
    );

    // Sending the canceled order in json form if
    // the product stock is updated + the order state is set to canceled.
    if (updateProductQty && updateOrderStatus) {
        res.status(200).json({ updateOrderStatus })
    } else {
        res.status(500);
        throw new Error('Internal server error');
    }
});

module.exports = { placeOrder, cancelOrder, getOrders }