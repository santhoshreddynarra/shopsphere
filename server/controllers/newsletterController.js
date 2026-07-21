import asyncHandler from '../middleware/asyncHandler.js';
import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingSubscriber = await Newsletter.findOne({ email: normalizedEmail });

  if (existingSubscriber) {
    return res.status(200).json({
      success: false,
      message: 'You are already subscribed.',
    });
  }

  const subscriber = await Newsletter.create({
    email: normalizedEmail,
  });

  if (subscriber) {
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully!',
    });
  } else {
    res.status(400);
    throw new Error('Invalid subscriber data');
  }
});

export { subscribeNewsletter };
