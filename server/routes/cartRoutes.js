import express from 'express';
import {
  addToCart,
  getCart,
  updateQuantity,
  removeProduct,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route('/').get(getCart);
router.route('/add').post(addToCart);
router.route('/update/:productId').put(updateQuantity);
router.route('/remove/:productId').delete(removeProduct);
router.route('/clear').delete(clearCart);

export default router;
