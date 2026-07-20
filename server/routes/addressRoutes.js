import express from 'express';
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(createAddress);

router.route('/:id')
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
