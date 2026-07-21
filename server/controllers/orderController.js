import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let itemsPrice = 0;
  let discountAmount = 0;
  const finalOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found for ID: ${item.product}`);
    }

    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    
    itemsPrice += product.price * item.qty;
    if (product.discountPrice > 0) {
      discountAmount += (product.price - product.discountPrice) * item.qty;
    }

    finalOrderItems.push({
      name: product.name,
      qty: item.qty,
      image: product.images && product.images.length > 0 ? product.images[0]?.url || product.images[0] : '',
      price: currentPrice,
      product: product._id,
    });
  }

  const subtotalAfterDiscount = itemsPrice - discountAmount;
  const taxPrice = Math.round(subtotalAfterDiscount * 0.18);
  const shippingPrice = subtotalAfterDiscount > 999 ? 0 : 99;
  const totalPrice = subtotalAfterDiscount + taxPrice + shippingPrice;

  // Deduct stock for all items
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.qty;
    await product.save();
  }

  const order = new Order({
    orderItems: finalOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod: 'Cash on Delivery',
    isPaid: false, 
    status: 'Processing',
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Clear user's cart in MongoDB after placing order
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if the order belongs to the user or if the user is an admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)) {
      res.status(400);
      throw new Error(`Cannot cancel an order with status: ${order.status}`);
    }

    order.status = 'Cancelled';
    await order.save();

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.qty;
        await product.save();
      }
    }

    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    order.status = 'Confirmed';

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;
    
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderToPaid,
  updateOrderStatus,
  getOrders,
};
