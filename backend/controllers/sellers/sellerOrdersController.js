const asyncHandler = require('express-async-handler');
const Order = require('../../models/Orders');
const Product = require('../../models/Products');

// GET 
// /api/seller/products/getorders
// Async function to get all the orders placed by the all the users
const getOrders = asyncHandler(async (req, res) => {
    // Fetching all the orders from the DB
    const allOrders = await Order.find({});

    // If any order exist it will be returned as a json response.
    if (allOrders) {
        res.status(200).json({ allOrders })
    } else {
        res.status(404);
        throw new Error('No orders placed at the moment.');
    }
});


// PUT 
// /seller/products/updateorderstate/:id
// Async function to update the state of any order
const updateOrderState = asyncHandler(async (req, res) => {
    const order = req.params.id;
    const orderStatus = req.body.orderStatus;

    // checking if order status is provided in request body
    if (!orderStatus) {
        res.status(400);
        throw new Error("Please provide an order state.");
    }

    // Finding the order whose state is to be updated by using the id provided
    // in request params 
    const findOrder = await Order.findOne({
        _id: order,
    });

    // Checking if the order exist or not.
    if (!findOrder) {
        res.status(404);
        throw new Error("The order can't be found.");
    }

    // Checking if the order is already at desired state or not.
    if (findOrder.status === orderStatus) {
        res.status(400);
        throw new Error("Order already at the given state.");
    }

    // Checking if the orders current state is delivered + the state to update 
    // is canceled because we can't cancel a delivered order.
    if (findOrder.status === "delivered" && orderStatus === "canceled") {
        res.status(400);
        throw new Error("A delivered order can not be cancel.");
    }

    // Checking if the order state is canceled because
    // we can't change the state of the order whose state is set to canceled.
    if (findOrder.status === "canceled") {
        res.status(400);
        throw new Error("Can't change the state of a canceled order");
    }

    // If the order is to be canceled then all the products units in an order
    // will be added back in stock.
    if (orderStatus === "canceled") {
        // Calling method that will add the products units back to stock.
        await updateProductQuantity(findOrder.products);
    }

    // Updating the order's state.
    const updateOrderStatus = await Order.findByIdAndUpdate(
        order,
        { status: orderStatus },
        { new: true }
    );
    
    // If the state is updated successfully then sending 
    // a json response with the order in it. 
    // If not then sending an internal server error.
    if (updateOrderStatus) {
        res.status(200).json({ updateOrderStatus });
    } else {
        res.status(500);
        throw new Error('Internal server error.');
    }
});


// The function that is used in updateOrderState API endpoint.
// It will add the ordered product units back to stock if the
// order is canceled.
const updateProductQuantity = async (products) => {
    const productQtyUpdate = products.map((product) => ({
        updateOne: {
            filter: { _id: product.product },
            update: { $inc: { quantity: +product.units } }
        }
    }));

    await Product.bulkWrite(productQtyUpdate);
};

module.exports = { getOrders, updateOrderState }