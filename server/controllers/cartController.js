import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  if (qty < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  if (cart) {
    // Check if product already exists in cart
    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists, update quantity
      let productItem = cart.products[itemIndex];
      const newQty = productItem.quantity + qty;
      
      if (product.stock < newQty) {
        res.status(400);
        throw new Error('Not enough stock available to add more');
      }

      productItem.quantity = newQty;
      productItem.subtotal = productItem.quantity * price;
      cart.products[itemIndex] = productItem;
    } else {
      // Product does not exist, add new item
      cart.products.push({
        productId,
        quantity: qty,
        price,
        subtotal: qty * price,
      });
    }
    await cart.save();
    res.status(200).json(cart);
  } else {
    // Create new cart for user
    const newCart = await Cart.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity: qty,
          price,
          subtotal: qty * price,
        }
      ]
    });
    res.status(201).json(newCart);
  }
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'products.productId',
    select: 'name images price discountPrice stock slug brand'
  });

  if (!cart) {
    return res.status(200).json({ products: [], totalAmount: 0 });
  }

  // Calculate total
  const totalAmount = cart.products.reduce((acc, item) => acc + item.subtotal, 0);

  // Return cart with populated product details and total
  res.status(200).json({
    _id: cart._id,
    user: cart.user,
    products: cart.products,
    totalAmount
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
const updateQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (qty < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  if (itemIndex > -1) {
    let productItem = cart.products[itemIndex];
    productItem.quantity = qty;
    productItem.subtotal = productItem.quantity * productItem.price;
    cart.products[itemIndex] = productItem;
    await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404);
    throw new Error('Product not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.products = cart.products.filter(p => p.productId.toString() !== productId);
  await cart.save();
  res.status(200).json(cart);
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    cart.products = [];
    await cart.save();
  }
  
  res.status(200).json({ message: 'Cart cleared' });
});

export { addToCart, getCart, updateQuantity, removeProduct, clearCart };
