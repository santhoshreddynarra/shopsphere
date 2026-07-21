import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../services/axiosInstance.js';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchFeaturedProducts, fetchProducts, fetchCategories, fetchBestSellers } from '../features/products/productSlice.js';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductCard from '../components/ProductCard.jsx';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(
        <div>
          <p className="font-bold">Invalid Email</p>
          <p className="text-sm">Please enter a valid email address.</p>
        </div>,
        { id: 'newsletter-error' }
      );
      return;
    }

    setIsSubscribing(true);
    try {
      const { data } = await axiosInstance.post('/newsletter/subscribe', { email });
      if (data.success) {
        toast.success(
          <div>
            <p className="font-bold">Subscribed Successfully!</p>
            <p className="text-sm">Thank you for subscribing to ShopSphere. You'll receive updates about new arrivals, exclusive offers, and upcoming sales.</p>
          </div>,
          { id: 'newsletter-success', duration: 5000 }
        );
        setEmail('');
      } else {
        toast(
          <div>
            <p className="font-bold">Already Subscribed</p>
            <p className="text-sm">This email is already subscribed to our newsletter.</p>
          </div>,
          { icon: 'ℹ️', id: 'newsletter-info', duration: 4000 }
        );
      }
    } catch (error) {
      toast.error(
        <div>
          <p className="font-bold">Subscription Failed</p>
          <p className="text-sm">Something went wrong. Please try again later.</p>
        </div>,
        { id: 'newsletter-error' }
      );
    } finally {
      setIsSubscribing(false);
    }
  };
  const dispatch = useAppDispatch();
  const { 
    featuredProducts, 
    products: newArrivals,
    bestSellers,
    categories,
    isFeaturedLoading,
    isBestSellersLoading,
    isLoading 
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchProducts({ limit: 4, sort: '-createdAt' }));
    dispatch(fetchBestSellers());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide mb-6">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              Discover Premium Products at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Best Prices</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
              Elevate your lifestyle with our curated selection of electronics, fashion, and home essentials. Experience shopping re-imagined.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-8 py-4 rounded-full transition-all shadow-sm flex items-center gap-2"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract shapes for hero background */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl pointer-events-none hidden md:block" />
      </section>

      {/* Features/Trust Bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹5,000' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Clock, title: '24/7 Support', desc: 'Dedicated support team' },
              { icon: ShoppingBag, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">{feature.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-slate-500 mt-2">Explore our wide range of collections</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories && categories.length > 0 ? (
            categories.slice(0, 6).map((cat) => (
              <Link 
                key={cat._id} 
                to={`/category/${cat.slug}`}
                className="group relative h-48 md:h-64 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Category'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg z-10">{cat.name}</h3>
              </Link>
            ))
          ) : (
            // Skeletons if categories are empty or loading
            Array.from({length: 6}).map((_, i) => (
              <div key={i} className="h-48 md:h-64 rounded-2xl bg-slate-200 animate-pulse" />
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Handpicked favorites that our customers love.</p>
          </div>
          
          <ProductGrid isLoading={isFeaturedLoading} skeletonCount={8}>
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Best Sellers</h2>
              <p className="text-slate-500 mt-2">Our most popular products this month.</p>
            </div>
            <Link to="/products?sort=-numSales" className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid isLoading={isBestSellersLoading} skeletonCount={4}>
            {bestSellers.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 mix-blend-overlay" />
          <div className="relative px-8 py-16 md:py-20 md:px-20 lg:w-2/3">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-widest mb-6">
              Trending Deals
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Get Up to 40% Off on Electronics
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-md">
              Upgrade your tech setup today. Discover the latest smartphones, laptops, and accessories at unbeatable prices.
            </p>
            <Link
              to="/products?category=electronics"
              className="inline-flex bg-white hover:bg-slate-50 text-slate-900 font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              Shop Electronics
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800" 
              alt="Promo"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-slate-500 mt-2">The latest additions to our collection.</p>
            </div>
            <Link to="/products?sort=-createdAt" className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <ProductGrid isLoading={isLoading} skeletonCount={4}>
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-indigo-600 py-20 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join our Newsletter</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubscribing}
              className="flex-1 px-6 py-4 rounded-full border-none focus:ring-4 focus:ring-indigo-300/50 outline-none text-slate-900 disabled:opacity-75"
            />
            <button 
              type="submit" 
              disabled={isSubscribing}
              className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
