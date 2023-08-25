const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'users'
    }, 
    products: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'products', 
            units: {
                type: Number, 
                required: [true, 'Please provide number of units of product.']
            }
        }
    ], 
    totalAmount: {
        type: Number, 
        require: true
    }, 
    status: {
        type: String, 
        required: true
    }
});