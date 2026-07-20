import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToWishlist } from '../features/wishlist/wishlistSlice.js';
import StarRating from './StarRating.jsx';
import Badge from './Badge.jsx';

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const navigate = useNavigate();

  const inWishlist = wishlist?.products?.some(p => p.productId === product._id || p.productId?._id === product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    dispatch(addToWishlist(product._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 flex flex-col relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm focus:opacity-100 ${
          inWishlist ? 'text-red-500 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] bg-slate-50">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && <Badge label="Featured" variant="featured" />}
          {hasDiscount && <Badge label={`-${discountPercent}%`} variant="sale" />}
          {product.stock === 0 && <Badge label="Out of Stock" variant="outofstock" />}
          {product.stock > 0 && product.stock <= 5 && <Badge label={`Only ${product.stock} Left!`} variant="warning" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1.5">
          {product.brand}
        </p>
        <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-slate-500 text-xs font-medium">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-slate-900 font-bold text-lg">
              ₹{displayPrice.toLocaleString('en-IN')}
            </p>
            {hasDiscount && (
              <p className="text-slate-400 text-xs font-medium line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
