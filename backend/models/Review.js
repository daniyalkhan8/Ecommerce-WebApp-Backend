const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
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
    rating: {
        type: Number, 
        required: [true, 'Please provide a rating for the product']
    }, 
    comment: {
        type: String
    }
});

module.exports = mongoose.model('reviews', reviewSchema);