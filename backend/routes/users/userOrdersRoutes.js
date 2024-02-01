const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../middleware/authMiddleware');
const { 
    placeOrder, 
    cancelOrder, 
    updateOrderState, 
    getOrders
} = require('../../controllers/users/usersOrdersController');

router.get('/getorders', verifyUserJWT, getOrders);
router.post('/placeorder', verifyUserJWT, placeOrder);
router.put('/updateorderstate/:id', verifyUserJWT, updateOrderState)
router.delete('/cancelorder/:id', verifyUserJWT, cancelOrder);

module.exports = router;