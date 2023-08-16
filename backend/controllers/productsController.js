const asyncHandler = require('express-async-handler');
const Products = require('../models/Products');
const { cloudinary } = require('../config/cloudinary');

// POST
// /api/products/add-product
// Async function to add a product of a seller
const addProduct = asyncHandler(async (req, res) => {
    const parsedData = JSON.parse(req.body.data);
    const { name, description, brand, price, quantity } = parsedData;
    const seller_id = req.seller.id;
    const image = req.files.image;

    // Validating if the all the required fields are present in their correct format
    if (!name || !description || !brand || !price || !quantity || !image) {
        res.status(400);
        throw new Error('Please enter all the required fields.');
    } else if (!parseFloat(price) || !parseInt(quantity)) {
        res.status(400);
        throw new Error('Invalid input for Price or Quantity');
    }

    // Uploading the product image to cloudinary
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "MERN-Ecommerce/Products"
    }).catch((err) => {
        res.status(500);
        throw new Error(err.message);
    });

    // Creating a new product instance in mongodb
    const newProduct = await Products.create({
        seller_id: seller_id,
        name: name,
        description: description,
        brand: brand,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    // Validating if the new product instance has been created
    if (newProduct) {
        res.status(201).json({ newProduct });
    } else {
        res.status(500);
        throw new Error("Internal server error.");
    }
});

// GET
// /api/products/get-seller-products
// Async function to get all the products of a seller


module.exports = { addProduct }