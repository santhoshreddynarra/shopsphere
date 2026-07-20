import React from 'react';

const variantClasses = {
  featured: 'bg-indigo-600/80 text-indigo-100',
  sale: 'bg-orange-500/80 text-orange-50',
  new: 'bg-emerald-600/80 text-emerald-50',
  outofstock: 'bg-slate-600/80 text-slate-300',
};

const Badge = ({ label, variant = 'featured' }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm ${variantClasses[variant]}`}
  >
    {label}
  </span>
);

export default Badge;
