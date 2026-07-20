import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => (
  <Link
    to={`/category/${category.slug}`}
    className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-800 hover:ring-2 hover:ring-indigo-500/60 transition-all duration-300"
  >
    <img
      src={category.image}
      alt={category.name}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/400x300?text=' + category.name;
      }}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-bold text-base group-hover:text-indigo-300 transition">
        {category.name}
      </h3>
      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{category.description}</p>
    </div>
  </Link>
);

export default CategoryCard;
