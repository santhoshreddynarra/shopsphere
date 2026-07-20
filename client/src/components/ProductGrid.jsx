import React from 'react';

const ProductSkeleton = () => (
  <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-800" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-800 rounded w-1/3" />
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
      <div className="h-3 bg-slate-800 rounded w-1/4" />
      <div className="flex justify-between mt-2">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="w-8 h-8 bg-slate-800 rounded-lg" />
      </div>
    </div>
  </div>
);

const ProductGrid = ({
  children,
  isLoading = false,
  skeletonCount = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        : children}
    </div>
  );
};

export { ProductSkeleton };
export default ProductGrid;
