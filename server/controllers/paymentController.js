import Stripe from 'stripe';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
let stripe = null;

try {
  // Only initialize if it looks somewhat like a valid key format, or let it throw
  if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
    stripe = new Stripe(stripeSecretKey);
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error.message);
}

// @desc    Create Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!stripe) {
    console.error('Stripe is not initialized. STRIPE_SECRET_KEY may be missing or invalid.');
    res.status(503);
    throw new Error('Payment service is currently unavailable. Please try again later.');
  }

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to pay for this order');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  const amountInPaise = Math.round(order.totalPrice * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error.message);
    res.status(500);
    throw new Error('Payment processing failed. Please try again later.');
  }
});

// @desc    Stripe Webhook
// @route   POST /api/payment/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      
      if (orderId) {
        const order = await Order.findById(orderId).populate('orderItems.product');
        
        if (order) {
          // Check if already paid to prevent duplicate processing
          if (!order.isPaid) {
            // Verify amount
            if (paymentIntent.amount === Math.round(order.totalPrice * 100)) {
              // Mark order as paid
              order.isPaid = true;
              order.paidAt = Date.now();
              order.status = 'Confirmed';
              order.paymentProvider = 'Stripe';
              order.paymentResult = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amountPaid: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                email_address: paymentIntent.receipt_email || '',
                webhook_ref: event.id,
              };

              // Deduct Inventory Stock!
              for (const item of order.orderItems) {
                // If populated
                if (item.product && item.product.stock !== undefined) {
                  item.product.stock -= item.qty;
                  await item.product.save();
                } else {
                  // Fallback if not fully populated
                  const productDoc = await Product.findById(item.product);
                  if (productDoc) {
                    productDoc.stock -= item.qty;
                    await productDoc.save();
                  }
                }
              }

              await order.save();
              console.log(`Order ${orderId} marked as paid from webhook and inventory updated.`);
            } else {
              console.error(`Amount mismatch for order ${orderId}: Expected ${Math.round(order.totalPrice * 100)}, got ${paymentIntent.amount}`);
            }
          }
        } else {
          console.error(`Order ${orderId} not found for payment_intent.succeeded`);
        }
      }
      break;
    }
      
    case 'payment_intent.payment_failed':
      console.error(`Payment failed: ${event.data.object.last_payment_error?.message}`);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('Webhook received and verified');
});

export { createPaymentIntent, stripeWebhook };
