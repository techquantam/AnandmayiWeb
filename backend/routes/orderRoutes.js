const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    createRazorpayOrder,
    verifyRazorpayPayment,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    getDashboardStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').post(protect, createRazorpayOrder);
router.route('/:id/verify').post(protect, verifyRazorpayPayment);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
