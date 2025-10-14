import { useState } from 'react';
import PropTypes from 'prop-types';

export function AnimatedIngredientCard({ item, imageSrc, onAddToCart, onRemove, isInCart = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onAddToCart(item.id);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <article 
      className={`ingredient-card group relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100 opacity-0 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : ''
      }`} />
      
      {/* Floating particles effect */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-brand/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      <div className="ingredient-card__image relative">
        <img 
          src={imageSrc} 
          alt={item.name} 
          loading="lazy"
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
        />
        
        {/* Quantity badge */}
        <div className="absolute top-2 right-2 bg-brand text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {item.quantity}
        </div>

        {/* Cart status indicator */}
        {isInCart && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            🛒 In Cart
          </div>
        )}
      </div>

      <div className="ingredient-card__body relative z-10">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-ink capitalize">{item.name}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-brand/80">Qty: {item.quantity}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className={`pill-button px-3 py-1 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              isAnimating 
                ? 'bg-green-500 text-white animate-pulse' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            onClick={handleAddToCart}
            disabled={isAnimating}
          >
            {isAnimating ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">🔄</span>
                Adding...
              </span>
            ) : (
              '🛒 Add to Cart'
            )}
          </button>
          
          <button
            type="button"
            className="pill-button bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() => onRemove(item)}
          >
            🗑️ Remove
          </button>
        </div>
      </div>

      {/* Hover overlay with cooking suggestions */}
      <div className={`absolute inset-0 bg-brand/90 text-white p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <span className="text-2xl mb-2">✨</span>
        <p className="text-sm font-semibold mb-1">Perfect for:</p>
        <p className="text-xs">
          {getRandomCookingSuggestion(item.name)}
        </p>
      </div>
    </article>
  );
}

// Helper function to get random cooking suggestions
function getRandomCookingSuggestion(ingredient) {
  const suggestions = {
    tomato: ['Fresh salads', 'Pasta sauces', 'Soups & stews'],
    onion: ['Stir-fries', 'Caramelized sides', 'Soup bases'],
    garlic: ['Roasted dishes', 'Marinades', 'Sautéed veggies'],
    chicken: ['Grilled mains', 'Curry dishes', 'Roasted dinners'],
    rice: ['Fried rice', 'Risottos', 'Grain bowls'],
    default: ['Creative cooking', 'Fusion dishes', 'Comfort food']
  };
  
  const options = suggestions[ingredient.toLowerCase()] || suggestions.default;
  return options[Math.floor(Math.random() * options.length)];
}

AnimatedIngredientCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired,
  imageSrc: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isInCart: PropTypes.bool
};
