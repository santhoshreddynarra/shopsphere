import asyncHandler from '../middleware/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    // Check if product already exists
    const itemExists = wishlist.products.find(p => p.productId.toString() === productId);

    if (itemExists) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    wishlist.products.push({ productId });
    await wishlist.save();
    res.status(200).json(wishlist);
  } else {
    // Create new wishlist
    const newWishlist = await Wishlist.create({
      user: req.user._id,
      products: [{ productId }]
    });
    res.status(201).json(newWishlist);
  }
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products.productId',
    select: 'name images price discountPrice stock slug brand rating numReviews'
  });

  if (!wishlist || wishlist.products.length === 0) {
    return res.status(200).json({ products: [] });
  }

  let modified = false;
  const validProducts = [];

  for (let item of wishlist.products) {
    // Remove if product was deleted
    if (!item.productId) {
      modified = true;
      continue;
    }
    validProducts.push(item);
  }

  if (modified) {
    wishlist.products = validProducts;
    await wishlist.save();
  }

  res.status(200).json(wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
  await wishlist.save();
  
  res.status(200).json(wishlist);
});

export { addToWishlist, getWishlist, removeFromWishlist };
