import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import StarRating from './StarRating.jsx';
import Badge from './Badge.jsx';

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-slate-800">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && <Badge label="Featured" variant="featured" />}
          {hasDiscount && <Badge label={`-${discountPercent}%`} variant="sale" />}
          {product.stock === 0 && <Badge label="Out of Stock" variant="outofstock" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-indigo-400 text-xs font-medium uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        <h3 className="text-slate-200 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-white transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-slate-500 text-xs">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base">
              ₹{displayPrice.toLocaleString('en-IN')}
            </p>
            {hasDiscount && (
              <p className="text-slate-500 text-xs line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            )}
          </div>
          <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-200">
            <ShoppingCart className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
