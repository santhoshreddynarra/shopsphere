import React from 'react';

export const SkeletonProductCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative animate-pulse">
      <div className="aspect-[4/5] bg-slate-200 w-full" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-10" />
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonCategoryList = () => {
  return (
    <div className="space-y-3 animate-pulse mt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 bg-slate-200 rounded" />
          <div className="h-3 bg-slate-200 rounded w-32" />
        </div>
      ))}
    </div>
  );
};
