const asyncHandler = require('express-async-handler');
const Product = require('../../models/Products');
const Cart = require('../../models/Cart');
const Order = require('../../models/Orders');

const placeOrder = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const cartItems = req.body.cartItems;
    const productsArray = [];
    let totalPrice = 0;

    if (!cartItems || cartItems.length === 0) {
        res.status(400);
        throw new Error("Can not place an empty order.");
    }

    const verifyCartItems = await Cart.find({ _id: { $in: cartItems } });

    if (!verifyCartItems || verifyCartItems.length !== cartItems.length) {
        res.status(404);
        throw new Error('Cart Item not found.');
    }

    for (let i = 0; i < verifyCartItems.length; i++) {
        prodObject = {
            product: verifyCartItems[i].product,
            units: verifyCartItems[i].quantity,
            price: verifyCartItems[i].price
        }
        productsArray.push(prodObject);
        totalPrice += verifyCartItems[i].price;
    }

    const newOrder = await Order.create({
        user: user,
        products: productsArray,
        totalPrice: totalPrice,
        status: "New"
    });

    const delCartItems = await Cart.deleteMany({ _id: { $in: cartItems } });

    const productUpdOperations = verifyCartItems.map(item => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity } }
        }
    }))

    const productQuantityUpdate = await Product.bulkWrite(productUpdOperations);

    if (newOrder && productQuantityUpdate && delCartItems) {
        res.status(200).json({ newOrder });
    } else {
        res.status(500);
        throw new Error('Internal Server Error.')
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const user = req.user.id;

    const allOrders = await Order.find({ user: user });
    if (allOrders) {
        res.status(200).json({ allOrders })
    } else {
        res.status(404);
        throw new Error('No orders placed at the moment.');
    }
});

const updateOrderState = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const order = req.params.id;
    const orderStatus = {}

    const findOrder = await Order.findOne({
        _id: order,
        user: user
    });

    if (!findOrder) {
        res.status(404);
        throw new Error("The order requested for cancelation can't be found.");
    }

    if (findOrder.status === "new") {
        orderStatus.status = "packed";
    } else if (findOrder.status === "packed") {
        orderStatus.status = "shipped";
    } else if (findOrder.status === "shipped") {
        orderStatus.status = "delivered";
    } else if (findOrder.status === "canceled") {
        res.status(200);
        throw new Error('The order is already cancelled.');
    }

    const updateOrderStatus = await Order.findByIdAndUpdate(
        order,
        orderStatus,
        { new: true }
    );

    if (updateOrderStatus) {
        res.status(200).json({ updateOrderStatus });
    } else {
        res.status(500);
        throw new Error('Internal server error.');
    }
});

const cancelOrder = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const order = req.params.id;

    const findOrder = await Order.findOne({
        _id: order,
        user: user
    });

    if (!findOrder) {
        res.status(404);
        throw new Error("The order requested for cancelation can't be found.");
    } else if (findOrder.status === "delivered") {
        res.status(422);
        throw new Error("Orders can not be canceled once delivered");
    }

    const productQtyUpdate = findOrder.products.map((product) => ({
        updateOne: {
            filter: { _id: product.product },
            update: { $inc: { quantity: +product.units } }
        }
    }));

    const updateProductQty = await Product.bulkWrite(productQtyUpdate);

    const updateOrderStatus = await Order.findByIdAndUpdate(
        order,
        { status: 'canceled' },
        { new: true }
    );

    if (updateProductQty && updateOrderStatus) {
        res.status(200).json({ updateOrderStatus })
    } else {
        res.status(500);
        throw new Error('Internal server error');
    }
});

module.exports = { placeOrder, cancelOrder, updateOrderState, getOrders }