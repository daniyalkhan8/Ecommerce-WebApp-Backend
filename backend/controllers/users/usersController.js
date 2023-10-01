const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Users = require('../../models/Users');
const jwt = require('jsonwebtoken');

// POST 
// /api/users/login
// Async function to login a user
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Checking if all the fields are present
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Validating if the user exist
    const verifyUser = await Users.findOne({ email: email });
    if (!verifyUser) {
        res.status(400);
        throw new Error('User not registered, please create an account first.');
    } else if (await bcrypt.compare(password, verifyUser.password)) {
        res.status(201).json({
            firstname: verifyUser.firstname,
            lastname: verifyUser.lastname,
            token: genToken(verifyUser.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid Credentials.')
    }
});

// POST 
// /api/users/register
// Asyn function to register a new user
const userRegister = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, dob, address } = req.body;

    // Checking if all the fields are present
    if (!firstname || !lastname || !email || !password || !dob || !address) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Checking if the User with same email already exist
    findUser = await Users.findOne({ email: email });
    if (findUser) {
        res.status(400);
        throw new Error('User already exist. Try with another email address');
    }

    // Hashing the users password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Creating new date object and extracting months, day and year from it
    const day = new Date(dob).getDay().toString();
    const month = (new Date(dob).getMonth() + 1).toString();
    const year = new Date(dob).getFullYear().toString();
    const dateofbirth = {
        month, day, year
    }

    // Creating new user
    const newUser = await Users.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPass,
        dateofbirth: dateofbirth,
        address: address
    });

    if (newUser) {
        res.status(201).json({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            token: genToken(newUser.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid Credentials');
    }
});

// PUT 
// /api/users/resetpassword
// Async function to reset password for a user
const resetPassword = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { password } = req.body;
    const { newPassword } = req.body;

    // Checking if all the fields are present
    if (!password || !newPassword) {
        res.status(400);
        throw new Error('Please enter all of the required fields');
    }

    // Find user and verify if the old password is correct
    const verifyUser = await Users.findById(id).select('password');
    if (!verifyUser) {
        res.status(401);
        throw new Error('Not Authorized');
    } else if (await bcrypt.compare(password, verifyUser.password)) {
        if (password !== newPassword) {
            // Hashing newPassword
            const salt = await bcrypt.genSalt(10);
            const hashedNewPass = await bcrypt.hash(newPassword, salt);
            const updPassUser = await Users.findByIdAndUpdate(id,
                { password: hashedNewPass },
                { new: true });
            res.status(201).json({ updPassUser });
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
const genToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECERET, {
        expiresIn: '30d'
    });
}

module.exports = { userLogin, userRegister, resetPassword }