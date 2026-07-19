import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products (with search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 12, 50);
  const skip = (page - 1) * limit;

  // Build query filter
  const filter = { isActive: true };

  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Category filter (by slug → ObjectId)
  if (req.query.category) {
    const cat = await Category.findOne({ slug: req.query.category });
    if (cat) filter.category = cat._id;
  }

  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Min rating
  if (req.query.minRating) {
    filter.rating = { $gte: Number(req.query.minRating) };
  }

  // Availability
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Build sort
  let sort = { createdAt: -1 }; // default: latest
  const sortBy = req.query.sortBy;
  if (sortBy === 'price_asc') sort = { price: 1 };
  else if (sortBy === 'price_desc') sort = { price: -1 };
  else if (sortBy === 'rating') sort = { rating: -1 };
  else if (sortBy === 'best_selling') sort = { numSales: -1 };
  else if (sortBy === 'latest') sort = { createdAt: -1 };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
    limit,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json(products);
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  })
    .populate('category', 'name slug')
    .lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Get related products (same category, exclude current)
// @route   GET /api/products/:slug/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate('category', 'name slug')
    .sort({ rating: -1 })
    .limit(4)
    .lean();

  res.json(related);
});

export { getProducts, getFeaturedProducts, getProductBySlug, getRelatedProducts };
