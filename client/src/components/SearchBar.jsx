import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search products...',
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Sync with initialValue when it changes (URL changes)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleChange = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      } else if (value.trim()) {
        navigate(`/search?search=${encodeURIComponent(value.trim())}`);
      }
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (onSearch) {
      onSearch(query);
    } else if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
