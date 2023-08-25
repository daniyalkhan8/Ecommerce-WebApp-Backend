const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    seller_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'sellers'
    }, 
    name: {
        type: String, 
        required: [true, 'Please add product name.']
    }, 
    description: {
        type: String, 
        required: [true, 'Please add product description.']
    }, 
    category: {
        type: String, 
        required: [true, 'Please add product category.']
    }, 
    brand: {
        type: String, 
        required: [true, 'Please add product brand.']
    }, 
    price: {
        type: Number, 
        required: [true, 'Please add product price.']
    }, 
    quantity: {
        type: Number, 
        required: [true, 'Please add product quantity.']
    }, 
    image: {
        public_id: {
            type: String, 
            required: [true, 'Please add product public id.']
        }, 
        url: {
            type: String, 
            required: [true, 'Please add product url.']
        }, 
    }, 
}, {
    timestamps: true
});

module.exports = mongoose.model('products', productSchema);