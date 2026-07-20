import Stripe from 'stripe';
import asyncHandler from '../middleware/asyncHandler.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  // Stripe accepts amounts in cents/smallest currency unit.
  // Assuming INR (rupees), amount should be multiplied by 100 to convert to paise.
  const amountInPaise = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export { createPaymentIntent };
