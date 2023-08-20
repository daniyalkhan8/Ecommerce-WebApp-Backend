const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const port = process.env.PORT || 5000;
const { connectDB } = require('./config/ecommdb');
const { errorHandler } = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');

const app = express();

// DB Connection
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles: true
}));

// Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/seller', require('./routes/sellerRoute'));
app.use('/api/seller/products', require('./routes/sellerProductRoute'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Backend is listening at port ${port}`);
});