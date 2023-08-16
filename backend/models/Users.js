const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add your firstname']
    },
    lastname: {
        type: String,
        required: [true, 'Please add your firstname']
    },
    email: {
        type: String,
        required: [true, 'Please add your firstname'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add your firstname']
    },
    dateofbirth: {
        day: {
            type: String,
            required: [true, 'Please add day of birth.']
        },
        month: {
            type: String,
            required: [true, 'Please add month of birth.']
        },
        year: {
            type: String,
            required: [true, 'Please add year of birth.']
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);