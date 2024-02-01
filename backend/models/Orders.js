const mongoose = require('mongoose');

const orderProductsSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
    },
    units: {
        type: Number,
        required: [true, 'Please provide number of units of product.']
    },
    price: {
        type: Number,
        required: [true, 'Please provide the price of the product quantity.']
    }
}, {
    _id: false
});

const ordersSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    products: [orderProductsSchema],
    totalPrice: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'packed', 'shipped', 'delivered', 'canceled'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', ordersSchema);