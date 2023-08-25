const mongoose = require('mongoose');

const wishListSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'products'
        }
    ]
});

module.exports = mongoose.model('wishlist', wishListSchema);