import React from 'react';

const ProductSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-slate-100" />
    <div className="p-5 space-y-4">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="flex justify-between mt-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
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
