const asyncHandler = require('express-async-handler');
const Products = require('../models/Products');
const { cloudinary } = require('../config/cloudinary');

// POST
// /api/seller/products/add-product
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
// /api/seller/products/get-product
// Async function to get all the products of a seller
const getProducts = asyncHandler(async (req, res) => {
    const seller_id = req.seller.id

    // Checking if the seller id is present
    if (!seller_id) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    // Fetching all the products of the seller.
    const fetchedProducts = await Products.find({ seller_id });

    // Conditionals for different scenarios that may occur when fetching products.
    if (!fetchedProducts) {
        res.status(201).json({ message: 'No products found, please add some products.' });
    } else if (fetchedProducts) {
        res.status(201).json({ fetchedProducts });
    } else {
        res.status(500);
        throw new Error('Internal Server Error');
    }
});

// PUT
// /api/seller/products/update-product
// Async function to update a selected product
const updateProduct = asyncHandler(async (req, res) => {
    let productUpdation = {}

    if (!req.seller) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    if (Object.keys(req.body).length === 0 && !req.files) {
        res.status(400);
        throw new Error("Please provide the fields that are to be updated.");
    }

    const verifyProduct = await Products.findById(req.params.id);

    if (!verifyProduct) {
        res.status(400);
        throw new Error('Product not found');
    }

    if (verifyProduct.seller_id.toString() !== req.seller.id) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    if ('data' in req.body) {
        const parsedData = JSON.parse(req.body.data);
        res.status(201).json({ parsedData });
    } else {
        res.status(400);
        throw new Error('Unacceptable keyword given');
    }

    if ('image' in req.files) {
        
    }
});

module.exports = { addProduct, getProducts, updateProduct }