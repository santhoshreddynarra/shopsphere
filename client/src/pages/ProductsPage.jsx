import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import { fetchProducts, fetchCategories } from '../features/products/productSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import { SkeletonProductCard } from '../components/common/Skeletons.jsx';
import { Filter, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { categorySlug } = useParams();

  const { products, pagination, categories, isLoading } = useAppSelector((state) => state.products);

  // Parse URL params or use React Router param
  const initialCategory = categorySlug || searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '-createdAt';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialRating = searchParams.get('rating') || '';
  const initialInStock = searchParams.get('inStock') === 'true';
  const page = parseInt(searchParams.get('page') || '1');

  // Local state for filters to allow debouncing/applying explicitly
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);
  const [priceRange, setPriceRange] = useState({ min: initialMinPrice, max: initialMaxPrice });
  const [minRating, setMinRating] = useState(initialRating);
  const [inStock, setInStock] = useState(initialInStock);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products based on URL params
    const params = {
      page,
      limit: 12,
      sort: sortOption,
    };
    if (initialSearch) params.search = initialSearch;
    if (initialCategory) params.category = initialCategory;
    if (initialMinPrice) params.minPrice = initialMinPrice;
    if (initialMaxPrice) params.maxPrice = initialMaxPrice;
    if (initialRating) params.minRating = initialRating;
    if (initialInStock) params.inStock = true;

    dispatch(fetchProducts(params));
    window.scrollTo(0, 0);
  }, [dispatch, page, sortOption, initialSearch, initialCategory, initialMinPrice, initialMaxPrice, initialRating, initialInStock]);

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    // Update or delete keys based on newParams
    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    
    // Always reset to page 1 when filters change (unless the update specifically targets page)
    if (!newParams.hasOwnProperty('page')) {
      params.set('page', '1');
    }

    navigate(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ search: searchTerm });
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    updateURL({ category: slug === selectedCategory ? '' : slug });
  };

  const applyFilters = () => {
    updateURL({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      rating: minRating,
      inStock: inStock ? 'true' : ''
    });
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOption('-createdAt');
    setPriceRange({ min: '', max: '' });
    setMinRating('');
    setInStock(false);
    navigate('/products');
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    updateURL({ sort: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      updateURL({ page: newPage });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
            <p className="text-slate-500 mt-1">Showing {products.length} of {pagination.total} results</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium w-full"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select 
              value={sortOption}
              onChange={handleSortChange}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-auto appearance-none"
            >
              <option value="-createdAt">Newest Arrivals</option>
              <option value="-numSales">Best Sellers</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Highest Rated</option>
              <option value="-discountPrice">Largest Discount</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`fixed inset-0 bg-slate-900/50 z-40 md:hidden ${isMobileFiltersOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileFiltersOpen(false)} />
          
          <aside className={`fixed inset-y-0 left-0 bg-white w-80 max-w-[80vw] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto md:relative md:translate-x-0 md:w-64 md:bg-transparent md:shadow-none md:z-auto ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 md:p-0 space-y-8">
              <div className="flex items-center justify-between md:hidden mb-4">
                <h2 className="font-bold text-lg text-slate-900">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              {/* Search */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Search</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategory === cat.slug}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className={`text-sm ${selectedCategory === cat.slug ? 'font-semibold text-indigo-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Minimum Rating</h3>
                <select 
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4 Stars & Above</option>
                  <option value="3">3 Stars & Above</option>
                  <option value="2">2 Stars & Above</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600">In Stock Only</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button onClick={applyFilters} className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="w-full bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-200 transition">
                  Clear All
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => <SkeletonProductCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button onClick={clearFilters} className="bg-indigo-50 text-indigo-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-100 transition">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(pagination.pages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition ${
                              page === pageNum 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.pages}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
