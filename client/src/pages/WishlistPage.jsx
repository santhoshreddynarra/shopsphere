import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchWishlist, removeFromWishlist, moveToCart } from '../features/wishlist/wishlistSlice.js';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import StarRating from '../components/StarRating.jsx';

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist, isLoading } = useAppSelector((state) => state.wishlist);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (productId) => {
    dispatch(moveToCart(productId));
  };

  if (isLoading && wishlist?.products?.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-indigo-600" />
        My Wishlist
      </h1>

      {wishlist?.products?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Save items you love here and move them to your cart when you're ready to buy!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist?.products?.map((item) => (
            <div key={item.productId._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 flex flex-col relative">
              
              <button 
                onClick={() => handleRemove(item.productId._id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link to={`/product/${item.productId.slug}`} className="relative overflow-hidden aspect-[4/5] bg-slate-50">
                <img
                  src={item.productId.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'}
                  alt={item.productId.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </Link>

              <div className="p-5 flex flex-col flex-grow">
                <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {item.productId.brand}
                </p>
                <Link to={`/product/${item.productId.slug}`}>
                  <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {item.productId.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1.5 mb-4">
                  <StarRating rating={item.productId.rating} />
                  <span className="text-slate-500 text-xs font-medium">({item.productId.numReviews})</span>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-bold text-lg">
                      ₹{(item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price).toLocaleString('en-IN')}
                    </p>
                    {item.productId.discountPrice > 0 && (
                      <p className="text-slate-400 text-xs font-medium line-through">
                        ₹{item.productId.price.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleMoveToCart(item.productId._id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
