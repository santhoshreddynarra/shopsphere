import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconSize} ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-600 fill-slate-600'
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
