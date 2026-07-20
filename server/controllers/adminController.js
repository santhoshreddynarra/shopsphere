import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();

  // Aggregate total revenue
  const revenueAggregation = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

  // Aggregate monthly revenue for the chart
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $month: '$paidAt' },
        revenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  const formattedMonthlyRevenue = monthlyRevenue.map((item) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[item._id - 1],
      revenue: item.revenue,
    };
  });

  // Aggregate pending orders count
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  
  // Aggregate low stock products
  const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

  res.json({
    totalUsers: usersCount,
    totalProducts: productsCount,
    totalOrders: ordersCount,
    totalRevenue,
    pendingOrders,
    lowStockProducts,
    monthlyRevenue: formattedMonthlyRevenue,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getDashboardStats, getUsers, updateUserRole };
