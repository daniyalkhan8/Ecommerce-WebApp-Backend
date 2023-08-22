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
    // Declaring an empty object that will contain all the fields to be updated.
    let productUpdation = {}

    // Validating if the seller id exist
    if (!req.seller) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    // Fetching product from req.params.id to check if it exist
    const verifyProduct = await Products.findById(req.params.id);

    // Conditional to check if the product exist or not
    if (!verifyProduct) {
        res.status(400);
        throw new Error('Product not found');
    }

    // Checking if the seller id provided by the authMiddleware and seller_id 
    // of the fetched product is same or not
    if (verifyProduct.seller_id.toString() !== req.seller.id) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    // Checking if the keyword data exist in req.body and data contains some key value pairs
    // and appending it to the the productUpdation empty object.
    if ('data' in req.body) {
        const parsedData = JSON.parse(req.body.data);
        if (Object.keys(parsedData).length > 0) {
            productUpdation = { ...parsedData }
        }
    }

    // Checking if the req.files is present and it contains image with 'image' key
    if (req.files && 'image' in req.files) {
        const image = req.files.image

        // Deleting the old image first
        await cloudinary.uploader.destroy(verifyProduct.image.public_id, {
            folder: 'MERN-Ecommerce/Products'
        }).catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });

        // Then adding the new image
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'MERN-Ecommerce/Products'
        }).catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });

        // Then appending the public_id and secure_url to the productUpdation empty object
        productUpdation = {
            ...productUpdation,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
    }

    // Checking if the productUpdation object is null or not
    // It will be null if the user hasn't provided both 'data' and 'image'
    if (Object.keys(productUpdation).length === 0) {
        res.status(400);
        throw new Error('Please provide some fileds to be updated.');
    }

    // If productUpdation is not null then this line will execute. It will update the prodct
    // by searching it with the product id provided in req.params.id
    const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        productUpdation,
        { new: true }
    );

    // If the product is updated successfully it will respond with updated product and if not
    // then it will respond with status code 500.
    if (updatedProduct) {
        res.status(201).json({ updatedProduct });
    } else {
        res.status(500);
        throw new Error('Internal Server Error');
    }
});

// DELETE
// /api/seller/products/delete-product
// Async function to delete a selected product
const deleteProduct = asyncHandler(async (req, res) => {
    // Validating if the seller id exist
    if (!req.seller) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    // Fetching product from req.params.id to check if it exist
    const verifyProduct = await Products.findById(req.params.id);

    // Conditional to check if the product exist or not
    if (!verifyProduct) {
        res.status(400);
        throw new Error('Product not found');
    }

    // Checking if the seller id provided by the authMiddleware and seller_id 
    // of the fetched product is same or not
    if (verifyProduct.seller_id.toString() !== req.seller.id) {
        res.status(401);
        throw new Error('Unauthorized Access');
    }

    // Deleting the image of the product from the cloudinary
    await cloudinary.uploader.destroy(verifyProduct.image.public_id, {
        folder: 'MERN-Ecommerce/Products'
    }).catch((err) => {
        res.status(500);
        throw new Error(err.message)
    });

    // Deleting the product from the database
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id })
});

module.exports = { addProduct, getProducts, updateProduct, deleteProduct }