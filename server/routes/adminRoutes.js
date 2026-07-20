import express from 'express';
import { getDashboardStats, getUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/stats').get(getDashboardStats);
router.route('/users').get(getUsers);
router.route('/users/:id/role').put(updateUserRole);

export default router;
