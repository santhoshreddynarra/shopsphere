import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchProductBySlug, fetchRelatedProducts, clearProduct } from '../features/products/productSlice.js';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice.js';
import StarRating from '../components/StarRating.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Badge from '../components/Badge.jsx';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { product, relatedProducts, isDetailLoading, error } = useAppSelector(state => state.products);
  const { userInfo } = useAppSelector(state => state.auth);
  const { wishlist } = useAppSelector(state => state.wishlist);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    dispatch(fetchRelatedProducts(slug));
    
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, slug]);

  // Handle active image reset when product changes
  useEffect(() => {
    if (product) setActiveImage(0);
  }, [product]);

  if (isDetailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-slate-200 rounded-3xl w-full" />
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(3)].map((_, i) => <div key={i} className="w-24 h-24 bg-slate-200 rounded-xl flex-shrink-0" />)}
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
          Back to Products
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice > 0;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const inWishlist = wishlist?.products?.some(p => p.productId === product._id || p.productId?._id === product._id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const handleWishlist = () => {
    if (inWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({ product }));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug || product.category}`} className="hover:text-indigo-600">
                {product.category.name || 'Category'}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-16">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Images */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-6 group cursor-zoom-in">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {hasDiscount && <Badge label={`-${discountPercent}%`} variant="sale" />}
                  {product.isFeatured && <Badge label="Featured" variant="featured" />}
                </div>
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-24 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === idx ? 'border-indigo-600 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
              <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-2">{product.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} />
                  <span className="text-slate-600 font-medium">({product.rating})</span>
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-slate-500">{product.numReviews} Reviews</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-sm">{product.numSales} Sold</span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-slate-900">₹{displayPrice.toLocaleString('en-IN')}</span>
                  {hasDiscount && (
                    <span className="text-xl text-slate-400 line-through font-medium mb-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">Inclusive of all taxes</p>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Action Area */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? (product.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-red-500'}`} />
                  <span className="font-medium text-slate-700">
                    {product.stock > 0 ? (product.stock <= 5 ? `Hurry, only ${product.stock} left in stock!` : 'In Stock') : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-14 w-32 flex-shrink-0">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                      >-</button>
                      <span className="flex-1 text-center font-semibold text-slate-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                      >+</button>
                    </div>
                  )}
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={handleWishlist}
                    className={`h-14 w-14 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all ${inWishlist ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Truck className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700 leading-tight">Free<br/>Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><RefreshCw className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700 leading-tight">30 Days<br/>Return</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><ShieldCheck className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700 leading-tight">1 Year<br/>Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border-t border-slate-200 p-6 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex py-3 border-b border-slate-100 last:border-0">
                    <span className="w-1/3 text-slate-500 font-medium">{spec.key}</span>
                    <span className="w-2/3 text-slate-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">You might also like</h2>
            <ProductGrid isLoading={false} skeletonCount={4}>
              {relatedProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
