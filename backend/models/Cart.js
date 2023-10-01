const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
    }, 
    quantity: {
        type: Number, 
        required: [true, 'Please provide some quantity of product to be added in cart.']
    },
    prodPrice: {
        type: Number, 
        required: true
    }, 
    price: {
        type: Number, 
        required: true
    }
});

module.exports = mongoose.model('cart', cartSchema);