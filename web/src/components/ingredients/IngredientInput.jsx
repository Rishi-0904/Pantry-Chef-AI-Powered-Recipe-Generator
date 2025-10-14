import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export function IngredientInput({ onAdd }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock suggestions - in real app, this would call the backend
  const MOCK_SUGGESTIONS = [
    { id: 'tomato', name: 'Tomato', category: 'vegetables' },
    { id: 'onion', name: 'Onion', category: 'vegetables' },
    { id: 'garlic', name: 'Garlic', category: 'vegetables' },
    { id: 'chicken', name: 'Chicken', category: 'proteins' },
    { id: 'rice', name: 'Rice', category: 'grains' },
    { id: 'pasta', name: 'Pasta', category: 'grains' },
    { id: 'spinach', name: 'Spinach', category: 'vegetables' },
    { id: 'mushroom', name: 'Mushroom', category: 'vegetables' },
    { id: 'bell-pepper', name: 'Bell Pepper', category: 'vegetables' },
    { id: 'cheese', name: 'Cheese', category: 'dairy' }
  ];

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = MOCK_SUGGESTIONS.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    
    onAdd(value);
    setValue('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.name);
    setShowSuggestions(false);
    onAdd(suggestion.name);
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥕',
      proteins: '🍗',
      grains: '🌾',
      dairy: '🧀',
      fruits: '🍎',
      herbs: '🌿',
      pantry: '🏺'
    };
    return icons[category] || '🥘';
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm text-ink shadow-inner outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/40"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. chickpeas, spinach"
          autoComplete="off"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-white/50 backdrop-blur-xl z-50 overflow-hidden animate-slideInDown"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 hover:bg-brand/5 ${
                  index === selectedIndex ? 'bg-brand/10' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{suggestion.name}</span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">{suggestion.category}</span>
                </div>
                <span className="text-xs text-brand">Add</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-xs uppercase tracking-[0.4em] text-brand/60 sm:flex">
          pantry
        </div>
      </div>
      <button 
        className="pill-button px-6 py-3 text-sm sm:px-10 hover:scale-105 transform transition-all duration-200" 
        type="submit"
      >
        <span className="flex items-center gap-2">
          <span>Add ingredient</span>
          <span className="animate-bounce">+</span>
        </span>
      </button>
    </form>
  );
}

IngredientInput.propTypes = {
  onAdd: PropTypes.func.isRequired
};
