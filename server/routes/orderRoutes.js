import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderToPaid,
  updateOrderStatus,
  getOrders,
} from '../controllers/orderController.js';
import { generateInvoice } from '../controllers/invoiceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/invoice').get(protect, generateInvoice);

export default router;
