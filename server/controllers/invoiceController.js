import PDFDocument from 'pdfkit';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';

// @desc    Generate PDF Invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure user owns order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(20).text('ShopSphere AI Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  // Customer Details
  doc.fontSize(14).text('Customer Details', { underline: true });
  doc.fontSize(10).text(`Name: ${order.shippingAddress.fullName}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Phone: ${order.shippingAddress.phone}`);
  doc.moveDown();

  // Shipping Address
  doc.fontSize(14).text('Shipping Address', { underline: true });
  doc.fontSize(10).text(order.shippingAddress.addressLine1);
  if (order.shippingAddress.addressLine2) doc.text(order.shippingAddress.addressLine2);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`);
  doc.text(order.shippingAddress.country);
  doc.moveDown();

  // Items
  doc.fontSize(14).text('Order Items', { underline: true });
  doc.moveDown(0.5);
  
  order.orderItems.forEach(item => {
    doc.fontSize(10).text(`${item.name} - ${item.qty} x INR ${item.price}`);
  });
  doc.moveDown();

  // Totals
  doc.fontSize(12).text(`Subtotal: INR ${order.itemsPrice}`);
  doc.text(`Shipping: INR ${order.shippingPrice}`);
  doc.text(`Tax: INR ${order.taxPrice}`);
  doc.fontSize(14).text(`Total: INR ${order.totalPrice}`, { underline: true });

  doc.end();
});

export { generateInvoice };
