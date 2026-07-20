import asyncHandler from '../middleware/asyncHandler.js';
import Address from '../models/Address.js';

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res) => {
  const { isDefault } = req.body;

  // If this is the first address or set as default, reset others
  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  // Check if it's the first address, make it default automatically
  const count = await Address.countDocuments({ user: req.user._id });
  
  const address = await Address.create({
    ...req.body,
    user: req.user._id,
    isDefault: count === 0 ? true : isDefault || false
  });

  res.status(201).json(address);
});

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json(addresses);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address || address.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedAddress);
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address || address.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Address not found');
  }

  const wasDefault = address.isDefault;
  await address.deleteOne();

  // If deleted address was default, make the most recently created one default
  if (wasDefault) {
    const nextAddress = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  res.status(200).json({ message: 'Address removed' });
});

export { createAddress, getAddresses, updateAddress, deleteAddress };
