const mongoose = require('mongoose');

const wishListSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('wishlist', wishListSchema);