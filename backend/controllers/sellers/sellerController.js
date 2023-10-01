const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Sellers = require('../../models/Sellers');
const jwt = require('jsonwebtoken');

// POST 
// /api/sellers/login
// Async function to login a seller
const sellerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Checking if all the fields are present
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Validating if the seller exist
    const verifySeller = await Sellers.findOne({ email: email });
    if (!verifySeller) {
        res.status(400);
        throw new Error('Seller not registered, please create an account first.');
    } else if (await bcrypt.compare(password, verifySeller.password)) {
        res.status(201).json({
            firstname: verifySeller.firstname,
            lastname: verifySeller.lastname,
            token: genToken(verifySeller.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid Credentials.')
    }
});

// POST 
// /api/sellers/register
// Asyn function to register a new seller
const sellerRegister = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, dob } = req.body;

    // Checking if all the fields are present
    if (!firstname || !lastname || !email || !password || !dob) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Checking if the Seller with same email already exist
    findSeller = await Sellers.findOne({ email: email });
    if (findSeller) {
        res.status(400);
        throw new Error('Seller already exist. Try with another email address');
    }

    // Hashing the Sellers password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Creating new date object and extracting months, day and year from it
    const day = new Date(dob).getDay().toString();
    const month = (new Date(dob).getMonth() + 1).toString();
    const year = new Date(dob).getFullYear().toString();
    const dateofbirth = {
        month, day, year
    }

    // Creating new seller
    const newSeller = await Sellers.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPass,
        dateofbirth: dateofbirth
    });

    if (newSeller) {
        res.status(201).json({
            firstname: newSeller.firstname,
            lastname: newSeller.lastname,
            token: genToken(newSeller.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid Credentials');
    }
});

// PUT 
// /api/sellers/resetpassword
// Async function to reset password for a seller
const sellerResetPass = asyncHandler(async (req, res) => {
    const id = req.seller.id;
    const { password } = req.body;
    const { newPassword } = req.body;

    // Checking if all the fields are present
    if (!password || !newPassword) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Find seller and verify if the old password is correct
    const verifySeller = await Sellers.findById(id).select('password');
    if (!verifySeller) {
        res.status(401);
        throw new Error('Not Authorized');
    } else if (await bcrypt.compare(password, verifySeller.password)) {
        if (password !== newPassword) {
            // Hashing newPassword
            const salt = await bcrypt.genSalt(10);
            const hashedNewPass = await bcrypt.hash(newPassword, salt);
            const updPassSeller = await Sellers.findByIdAndUpdate(id,
                { password: hashedNewPass },
                { new: true });
            res.status(201).json({ updPassSeller });
        } else {
            res.status(401);
            throw new Error('The new password and old password should not be similar.');
        }
    } else {
        res.status(401);
        throw new Error('The current password is incorrect.');
    }
});

// Function to generate JWT
const genToken = (seller) => {
    return jwt.sign({ seller }, process.env.JWT_SECERET, {
        expiresIn: '30d'
    });
}

module.exports = { sellerLogin, sellerRegister, sellerResetPass }